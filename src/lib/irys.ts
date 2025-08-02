export interface IrysUploadResult {
  success: boolean;
  transactionId?: string;
  gatewayUrl?: string;
  explorerUrl?: string;
  error?: string;
}

export const uploadToIrys = async (htmlContent: string): Promise<IrysUploadResult> => {
  try {
    console.log('Starting upload to Irys testnet via API...');
    
    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new Error('No HTML content provided for upload');
    }
    
    const response = await fetch('/api/upload-to-irys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ htmlContent }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }
    
    console.log('Upload successful!');
    console.log('Transaction ID:', result.transactionId);
    console.log('Gateway URL:', result.gatewayUrl);
    console.log('Explorer URL:', result.explorerUrl);
    
    return result;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to upload to Irys:', error);
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      success: false,
      error: errorMessage
    };
  }
};