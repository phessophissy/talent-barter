// REOWN AppKit wallet integration
import { ethers } from 'ethers';

// Celo Mainnet cUSD contract address
const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
const CUSD_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)'
];

// TalentAccessGate contract address (deployed on Celo)
const ACCESS_GATE_ADDRESS = '0xC910EEFE0E1b1B25fD413ACf2b23AE04386fE69e';
const ACCESS_GATE_ABI = [
  'function payAccess() external',
  'function hasAccess(address user) view returns (bool)'
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string | undefined> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Switch to Celo mainnet if not already
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4ec' }], // Celo Mainnet chainId: 42220
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xa4ec',
            chainName: 'Celo Mainnet',
            nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
            rpcUrls: ['https://forno.celo.org'],
            blockExplorerUrls: ['https://celoscan.io']
          }]
        });
      }
    }
    
    return accounts[0];
  } catch (error: any) {
    console.error('Wallet connection failed:', error);
    throw new Error(error.message || 'Failed to connect wallet');
  }
}

export async function payAccess(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    
    // Get cUSD contract
    const cusdContract = new ethers.Contract(CUSD_ADDRESS, CUSD_ABI, signer);
    
    // Get AccessGate contract
    const accessGateContract = new ethers.Contract(ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI, signer);
    
    // Amount: 1 cUSD (18 decimals)
    const amount = ethers.parseUnits('1', 18);
    
    // Check balance first
    const balance = await cusdContract.balanceOf(userAddress);
    if (balance < amount) {
      throw new Error('Insufficient cUSD balance. You need at least 1 cUSD.');
    }
    
    // Step 1: Approve the AccessGate contract to spend 1 cUSD
    console.log('Approving cUSD spend...');
    const approveTx = await cusdContract.approve(ACCESS_GATE_ADDRESS, amount);
    await approveTx.wait();
    console.log('Approval confirmed');
    
    // Step 2: Call payAccess() on the contract - this records the payment
    console.log('Calling payAccess on contract...');
    const payTx = await accessGateContract.payAccess();
    await payTx.wait();
    console.log('Payment confirmed and access recorded');
    
    return true;
  } catch (error: any) {
    console.error('Payment failed:', error);
    // Parse common errors
    if (error.message?.includes('user rejected')) {
      throw new Error('Transaction was rejected by user');
    }
    if (error.message?.includes('Access already granted')) {
      throw new Error('You already have access! Please refresh the page.');
    }
    throw new Error(error.reason || error.message || 'Payment failed');
  }
}

export async function checkCUSDBalance(address: string): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return '0';
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const cusdContract = new ethers.Contract(CUSD_ADDRESS, CUSD_ABI, provider);
    const balance = await cusdContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  } catch {
    return '0';
  }
}

// Check if user has already paid for access (reads from contract)
export async function checkAccessStatus(userAddress: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Use public RPC to check - doesn't require wallet connection
    const provider = new ethers.JsonRpcProvider('https://forno.celo.org');
    const accessGateContract = new ethers.Contract(ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI, provider);
    const hasAccess = await accessGateContract.hasAccess(userAddress);
    return hasAccess;
  } catch (error) {
    console.error('Error checking access status:', error);
    return false;
  }
}

export { ACCESS_GATE_ADDRESS };
