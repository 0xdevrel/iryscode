import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface GenerateCodeRequest {
  prompt: string;
  previousContext?: string;
}

export interface GenerateCodeResponse {
  code: string;
  explanation: string;
}

// System prompt for code generation
const SYSTEM_PROMPT = `You are an expert web developer and designer specializing in creating beautiful, modern, SEO-optimized, and functional static websites using only HTML, CSS, and JavaScript. The current year is 2025.

CRITICAL REQUIREMENTS:
1. Generate ONLY complete, self-contained HTML files with embedded CSS and JavaScript
2. NO external dependencies, libraries, or frameworks (except standard web APIs)
3. NO server-side code or backend functionality
4. Images are ALLOWED through external URLs (Unsplash, Pexels, or other free sources)
5. Use modern CSS features like Flexbox, Grid, CSS variables, and advanced styling
6. Ensure responsive design that works perfectly on desktop, tablet, and mobile
7. Include semantic HTML5 and accessibility features (ARIA labels, proper contrast)
8. Add smooth animations, transitions, and micro-interactions
9. Use professional, modern color schemes and typography
10. Include interactive JavaScript functionality when relevant

SEO OPTIMIZATION REQUIREMENTS:
- Include proper meta tags (title, description, keywords, viewport)
- Use semantic HTML5 structure (header, nav, main, section, article, aside, footer)
- Implement proper heading hierarchy (h1, h2, h3, etc.)
- Add alt attributes to all images with descriptive text
- Include Open Graph meta tags for social media sharing
- Use descriptive title tags (50-60 characters optimal)
- Write compelling meta descriptions (150-160 characters optimal)
- Include structured data (JSON-LD) when relevant
- Use proper URL structure and internal linking
- Optimize for Core Web Vitals (fast loading, no layout shifts)
- Include canonical URLs and proper lang attributes

UI/UX EXCELLENCE STANDARDS:
- Follow 2025 design trends: minimalism, glassmorphism, subtle gradients
- Use modern spacing (8px grid system), typography scales, and visual hierarchy
- Implement hover states, focus states, and loading animations
- Create intuitive navigation and user flows
- Use CSS Grid and Flexbox for complex layouts
- Implement dark/light mode toggle when appropriate
- Add subtle shadows, rounded corners, and modern visual effects
- Ensure 60fps smooth animations and transitions

RESPONSIVE DESIGN:
- Mobile-first approach with progressive enhancement
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large)
- Fluid typography using clamp() and viewport units
- Flexible layouts that adapt gracefully
- Touch-friendly interface elements (44px minimum touch targets)
- Optimized for both portrait and landscape orientations

VISUAL ELEMENTS & IMAGES:
- Use high-quality, relevant images from Unsplash, Pexels, or similar free sources
- Always include descriptive alt attributes for SEO and accessibility
- Implement lazy loading for images (loading="lazy")
- Use responsive images with proper srcset when needed
- Combine images with Unicode symbols, emoji, and CSS-drawn icons
- Create graphics with CSS (shapes, patterns, illustrations) when appropriate
- Use CSS gradients, box-shadows, and transforms for visual appeal

OUTPUT FORMAT:
- Return ONLY the complete HTML code
- Include comprehensive SEO meta tags in <head>
- Include all CSS in <style> tags in the <head>
- Include all JavaScript in <script> tags before closing </body>
- Ensure code is properly formatted, indented, and production-ready
- Make it visually stunning and professionally designed
- Include comments explaining SEO elements and complex sections

SEO & QUALITY CHECKLIST:
✓ Complete meta tag implementation (title, description, OG tags)
✓ Semantic HTML5 structure with proper headings
✓ All images have descriptive alt attributes
✓ Fully responsive across all devices
✓ Modern 2025 design aesthetic
✓ Smooth animations and interactions
✓ Accessible and semantic markup
✓ Professional color palette and typography
✓ Fast loading and optimized performance
✓ Structured data when relevant
✓ Core Web Vitals optimized`;

export async function generateCode(
  request: GenerateCodeRequest,
  onStream?: (partialCode: string) => void
): Promise<GenerateCodeResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `${SYSTEM_PROMPT}

USER REQUEST: ${request.prompt}

${request.previousContext ? `PREVIOUS CONTEXT: ${request.previousContext}` : ''}

Generate a complete, self-contained HTML file that fulfills the user's request. Make it visually stunning and fully functional.`;

    if (onStream) {
      // Use streaming for real-time updates
      const result = await model.generateContentStream(prompt);
      let accumulatedCode = '';
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedCode += chunkText;
        
        // Clean up the accumulated response
        let cleanedCode = accumulatedCode
          .replace(/```html\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        // Only stream if we have meaningful content
        if (cleanedCode.length > 0) {
          onStream(cleanedCode);
        }
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
      // Use regular generation for non-streaming
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let generatedCode = response.text();

      // Clean up the response - remove markdown code blocks if present
      generatedCode = generatedCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

      // Ensure it starts with <!DOCTYPE html> or <html>
      if (!generatedCode.toLowerCase().includes('<!doctype html>') && 
          !generatedCode.toLowerCase().startsWith('<html>')) {
        generatedCode = `<!DOCTYPE html>\n${generatedCode}`;
      }

      return {
        code: generatedCode,
        explanation: 'Code generated successfully using Gemini Flash 2.5'
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
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
  'Create an SEO-optimized tech startup landing page with hero images and glassmorphism',
  'Build a personal portfolio with professional photos and SEO meta tags',
  'Design a modern blog layout with featured images and optimized headings',
  'Create a product showcase with high-quality product images and structured data',
  'Build a restaurant website with food photography and local SEO optimization',
  'Design a travel blog with stunning destination images and travel schema',
  'Create a fitness landing page with workout images and health-focused SEO',
  'Build a creative agency portfolio with project images and case studies',
  'Design an e-commerce product page with multiple images and rich snippets',
  'Create a real estate website with property photos and location schema',
  'Build a photography portfolio with gallery images and artist bio SEO',
  'Design a medical practice website with professional images and health schema',
  'Create a construction company site with project photos and service SEO',
  'Build a fashion blog with style images and fashion-focused keywords',
  'Design a technology review site with product images and review schema'
];