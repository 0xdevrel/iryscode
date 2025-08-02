# 🚀 Quick Setup Guide for Iryscode

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

## Step 2: Configure Environment

1. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace `your_gemini_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

## Step 3: Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Start Creating!

1. **Type a prompt** in the chat sidebar like:
   - "Create a modern portfolio website"
   - "Build a landing page for a restaurant"
   - "Design a product showcase page"

2. **Watch the magic happen** - The AI will generate complete HTML with CSS and JavaScript

3. **Preview in real-time** - See your website in desktop, tablet, and mobile views

4. **Edit the code** - Fine-tune using the Monaco editor

5. **Download your site** - Export the complete HTML file

## Example First Prompt

Try this to get started:

> "Create a modern personal portfolio website with a hero section, about section, skills showcase, and contact form. Use a dark theme with gradient backgrounds and smooth animations."

---

**Need help?** Check the main [README.md](README.md) for detailed documentation.