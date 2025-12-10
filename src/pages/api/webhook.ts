import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle Farcaster frame webhook events
  const { untrustedData, trustedData } = req.body;

  console.log('Farcaster webhook received:', {
    fid: untrustedData?.fid,
    buttonIndex: untrustedData?.buttonIndex,
    timestamp: untrustedData?.timestamp,
  });

  // Return success
  res.status(200).json({ success: true });
}
