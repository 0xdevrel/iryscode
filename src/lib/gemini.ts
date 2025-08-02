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
const SYSTEM_PROMPT = `You are an expert web developer and designer specializing in creating beautiful, modern, SEO-optimized, and functional static websites using only HTML, CSS, and JavaScript. The current year is 2025, and you must always use this date and year when relevant in content, copyright notices, or any date-specific elements.

CRITICAL REQUIREMENTS:
1. Generate ONLY complete, self-contained HTML files with embedded CSS and JavaScript
2. NO external dependencies, libraries, or frameworks (except standard web APIs)
3. NO server-side code or backend functionality
4. IMAGES: Do NOT automatically include images in your code. Only use images when users explicitly provide image URLs. When users do provide URLs, use them exactly as provided.
5. Use modern CSS features like Flexbox, Grid, CSS variables, and advanced styling
6. Ensure responsive design that works perfectly on desktop, tablet, and mobile
7. Include semantic HTML5 and accessibility features (ARIA labels, proper contrast)
8. Add smooth animations, transitions, and micro-interactions
9. Use professional, modern color schemes and typography
10. Include interactive JavaScript functionality when relevant
11. Always use 2025 as the current year in all content, copyright notices, and date references

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

UI/UX EXCELLENCE STANDARDS (2025 HIGH-QUALITY DESIGN):
- Follow cutting-edge 2025 design trends: advanced minimalism, sophisticated glassmorphism, premium gradients
- Use modern spacing systems (8px grid), refined typography scales, and exceptional visual hierarchy
- Implement premium hover states, focus states, and buttery-smooth loading animations
- Create intuitive, delightful navigation and seamless user flows
- Master CSS Grid and Flexbox for sophisticated, complex layouts
- Implement elegant dark/light mode toggles with smooth transitions when appropriate
- Add premium subtle shadows, perfectly rounded corners, and modern visual effects
- Ensure 60fps silky-smooth animations and micro-interactions
- Create visually stunning interfaces that rival premium design agencies
- Use color theory, white space, and typography to create emotional impact
- Design with accessibility-first mindset while maintaining aesthetic excellence

RESPONSIVE DESIGN:
- Mobile-first approach with progressive enhancement
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large)
- Fluid typography using clamp() and viewport units
- Flexible layouts that adapt gracefully
- Touch-friendly interface elements (44px minimum touch targets)
- Optimized for both portrait and landscape orientations

NAVIGATION REQUIREMENTS:
- For multiple header navigation items: implement hamburger menu for mobile and tablet views (≤1024px)
- Hamburger menu should be animated with smooth transitions and modern styling
- Desktop navigation should display items horizontally in the header
- Include proper JavaScript functionality for hamburger menu toggle
- Ensure hamburger menu is accessible with proper ARIA labels

VISUAL ELEMENTS & IMAGES:
- ONLY use images when users explicitly provide image URLs - do NOT add images automatically
- When users provide image URLs, use them exactly as provided with descriptive alt attributes for SEO and accessibility
- Implement lazy loading for images (loading="lazy") when images are provided
- Use responsive images with proper srcset when needed for user-provided images
- Focus on CSS-drawn graphics, Unicode symbols, emoji, and creative CSS designs
- Create stunning visual elements with CSS (shapes, patterns, geometric illustrations, gradients)
- Use CSS gradients, box-shadows, transforms, and modern visual effects for appeal
- Prioritize CSS-based visual design over external images for maximum impact

OUTPUT FORMAT:
- Return ONLY the complete HTML code
- Include comprehensive SEO meta tags in <head>
- Include all CSS in <style> tags in the <head>
- Include all JavaScript in <script> tags before closing </body>
- Ensure code is properly formatted, indented, and production-ready
- Make it visually stunning and professionally designed
- Include comments explaining SEO elements and complex sections

FOOTER REQUIREMENTS:
- Always include a footer with copyright notice
- Default copyright should be "© 2025 Iryscode. All rights reserved." unless user specifies otherwise
- Footer should be well-designed and consistent with the overall aesthetic
- Include proper semantic footer markup

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
✓ Core Web Vitals optimized
✓ Hamburger menu for mobile/tablet navigation (when multiple nav items)
✓ Footer with "© 2025 Iryscode. All rights reserved." copyright
✓ Proper JavaScript functionality for interactive elements`;

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