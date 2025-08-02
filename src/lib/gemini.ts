// Client-side interface - no longer imports GoogleGenerativeAI directly

export interface GenerateCodeRequest {
  prompt: string;
  previousContext?: string;
}

export interface GenerateCodeResponse {
  code: string;
  explanation: string;
}


export async function generateCode(
  request: GenerateCodeRequest,
  onStream?: (partialCode: string) => void
): Promise<GenerateCodeResponse> {
  try {
    if (onStream) {
      // Handle streaming through server API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate code');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedCode = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          accumulatedCode += chunkText;

          // Clean up the accumulated response
          const cleanedCode = accumulatedCode
            .replace(/```html\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

          // Only stream if we have meaningful content
          if (cleanedCode.length > 0) {
            onStream(cleanedCode);
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Final cleanup
      let generatedCode = accumulatedCode
        .replace(/```html\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Ensure it starts with <!DOCTYPE html> or <html>
      if (!generatedCode.toLowerCase().includes('<!doctype html>') && 
          !generatedCode.toLowerCase().startsWith('<html>')) {
        generatedCode = `<!DOCTYPE html>\n${generatedCode}`;
      }

      return {
        code: generatedCode,
        explanation: 'Code generated successfully using Gemini Flash 2.5'
      };
    } else {
      // Handle regular generation through server API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate code');
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Code generation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate code');
  }
}

export async function improveCode(
  currentCode: string, 
  improvementRequest: string,
  onStream?: (partialCode: string) => void
): Promise<GenerateCodeResponse> {
  return generateCode({
    prompt: `Improve the following code based on this request: "${improvementRequest}"`,
    previousContext: `Current code:\n${currentCode}`
  }, onStream);
}

// Predefined prompts for quick generation
export const QUICK_PROMPTS = [
  'Create an SEO-optimized tech startup landing page with CSS hero graphics and glassmorphism',
  'Build a personal portfolio with CSS-drawn illustrations and SEO meta tags',
  'Design a modern blog layout with CSS graphics and optimized headings',
  'Create a product showcase with CSS-based visuals and structured data',
  'Build a restaurant website with CSS food illustrations and local SEO optimization',
  'Design a travel blog with CSS destination graphics and travel schema',
  'Create a fitness landing page with CSS workout icons and health-focused SEO',
  'Build a creative agency portfolio with CSS graphics and case studies',
  'Design an e-commerce product page with CSS product visuals and rich snippets',
  'Create a real estate website with CSS property graphics and location schema',
  'Build a photography portfolio with CSS gallery layouts and artist bio SEO',
  'Design a medical practice website with CSS health icons and health schema',
  'Create a construction company site with CSS project graphics and service SEO',
  'Build a fashion blog with CSS style graphics and fashion-focused keywords',
  'Design a technology review site with CSS tech icons and review schema'
];