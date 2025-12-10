// Celo smart contract interaction
import { ethers } from 'ethers';

export async function checkAccess(contractAddress: string, userAddress: string, providerUrl?: string) {
  if (!contractAddress || contractAddress.trim() === "") {
    throw new Error("Contract address is required and cannot be empty.");
  }
  const abi = ["function hasAccess(address user) view returns (bool)"];
  const provider = new ethers.JsonRpcProvider(providerUrl || "https://forno.celo.org");
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract.hasAccess(userAddress);
}
