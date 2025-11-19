import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { authOptions } from '@/lib/auth';
import getLLmApiKey from '@/lib/langchain/embeding/llm_api_key';

// Define the structured output schema for blog posts
const BlogPostSchema = z.object({
  title: z.string().describe("The title of the blog post"),
  content: z.string().describe("HTML content of the blog post with proper formatting and image placements using Tailwind CSS classes"),
  excerpt: z.string().describe("Brief excerpt/summary of the blog post"),
  tags: z.array(z.string()).describe("Relevant tags for the blog post"),
  seoTitle: z.string().describe("SEO-optimized title"),
  seoDescription: z.string().describe("SEO-optimized meta description"),
  featuredImage: z.string().describe("URL of the featured image or empty string if none"),
  imagePlacements: z.array(
    z.object({
      imageUrl: z.string().describe("URL of the image"),
      position: z.number().describe("Position in the content where image should be placed"),
      caption: z.string().describe("Caption for the image or empty string if none"),
      altText: z.string().describe("Alt text for accessibility")
    })
  ).describe("Strategic placements for images throughout the content")
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, images, tone = 'professional', length = 'medium', category = 'INDUSTRY_NEWS' } = body;
    
    console.log('Received images for AI generation:', images);
    
    // Generate blog content using LangChain with structured output
    const aiResponse = await generateBlogContentWithLangChain({
      prompt,
      images: images || [],
      tone,
      length,
      category,
    });

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error generating AI blog content:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog content' },
      { status: 500 }
    );
  }
}

interface ImageData {
  url: string;
  description?: string;
  altText?: string;
}

async function generateBlogContentWithLangChain({
  prompt,
  images,
  tone,
  length,
  category
}: {
  prompt: string;
  images: ImageData[];
  tone: string;
  length: string;
  category: string;
}) {
  const { apikey, geminiApiKey } = await getLLmApiKey();
  
  // Initialize the chat model
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    apiKey: apikey,
  });

  try {
    // Configure model for structured output
    const structuredModel = model.withStructuredOutput(BlogPostSchema, {
      name: "blog_post",
      includeRaw: false
    });

    // Build the system message
    const systemMessage = new SystemMessage(buildSystemPrompt({ tone, length, category, images }));

    // Build the human message with multimodal content
    const humanMessage = buildHumanMessage(prompt, images);

    console.log('Generating content with structured output and multimodal input...');
    const response = await structuredModel.invoke([systemMessage, humanMessage]);

    console.log('Structured output received successfully', response);
    
    // Ensure all required fields have values
    return ensureRequiredFields(response, images);

  } catch (structuredError) {
    console.error('Structured output failed:', structuredError);
    
    // Fallback: Use regular model invocation without structured output
    return await generateFallbackContent(model, prompt, images, tone, length, category);
  }
}

function buildSystemPrompt({ tone, length, category, images }: {
  tone: string;
  length: string;
  category: string;
  images: ImageData[];
}) {
  return `
You are an expert content writer specializing in the laundry, dry cleaning, and commercial cleaning equipment industry.
Your task is to create professional, engaging blog posts that educate industry professionals.

CRITICAL TAILWIND CSS INSTRUCTIONS:
1. Generate content in clean, semantic HTML format with Tailwind CSS classes
2. Use proper heading hierarchy (h1, h2, h3) with appropriate typography classes
3. Apply consistent Tailwind CSS styling throughout all elements
4. Analyze the provided images and strategically place them throughout the content where they add value
5. Write compelling alt text and captions for each image based on visual analysis
6. Create SEO-optimized metadata
7. Tone: ${tone}
8. Length: ${length} (${getWordCount(length)})
9. Category: ${category}

TAILWIND CSS HTML STRUCTURE REQUIREMENTS:
- Start with <div class="prose prose-lg max-w-none">
- Use proper semantic elements with Tailwind classes
- Include image containers with appropriate styling
- Add lists, blockquotes, and other rich content elements with proper spacing
- Use proper HTML formatting with indentation

TAILWIND CSS CLASSES TO USE:
- Container: "prose prose-lg max-w-none" for main content wrapper
- Headings: Use semantic h1-h6, prose will handle typography
- Images: "w-full h-auto rounded-lg shadow-md mx-auto my-6"
- Image containers: "flex flex-col items-center my-8"
- Captions: "text-sm text-gray-600 mt-2 text-center italic"
- Paragraphs: "mb-4" (prose handles most, but add spacing where needed)
- Lists: "list-disc list-inside mb-4 space-y-1"
- Blockquotes: "border-l-4 border-blue-500 pl-4 italic my-6"
- Code/technical terms: "bg-gray-100 px-2 py-1 rounded text-sm font-mono"
- Callout sections: "bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r"
- Tables: "w-full border-collapse border border-gray-300 my-6"
- Table cells: "border border-gray-300 px-4 py-2"

IMAGE INTEGRATION REQUIREMENTS:
${images.length > 0 ? `
USE THESE EXACT IMAGE URLs IN YOUR HTML CONTENT:
${images.map((image, index) => `
Image ${index + 1}: 
URL: ${image.url}
Description: ${image.description || 'No description provided'}
Alt Text: ${image.altText || 'Needs appropriate alt text'}

CRITICAL: You MUST use the exact image URLs provided above in your HTML content.
Use proper <img> tags with Tailwind classes like: 
<div class="flex flex-col items-center my-8">
  <img src="${image.url}" alt="your descriptive alt text" class="w-full h-auto rounded-lg shadow-md max-w-2xl mx-auto">
  <p class="text-sm text-gray-600 mt-2 text-center italic">Your descriptive caption here</p>
</div>
`).join('\n')}

STRATEGIC IMAGE PLACEMENT:
- Place images at logical points in your content where they enhance understanding
- Write descriptive captions that explain what the image shows
- Use appropriate alt text for accessibility
- Consider image order and relevance to surrounding content
` : 'No images provided - create content without specific image references.'}

CONTENT STRUCTURE WITH TAILWIND:
- Start with: <div class="prose prose-lg max-w-none">
- Use proper heading hierarchy: h1 for title, h2 for main sections, h3 for subsections
- Include introductory paragraph with engaging hook
- Use sections with clear headings
- Incorporate bullet points and numbered lists where appropriate
- Add callout boxes for important tips or warnings
- Include technical specifications in styled tables when relevant
- End with a conclusion or summary section

INDUSTRY CONTEXT:
Focus on topics like:
- Commercial laundry equipment (washers, dryers, ironers, extractors)
- Dry cleaning machines and solvent systems
- Industrial finishing equipment (presses, folders, steam cabinets)
- Maintenance and repair best practices
- Business operations and profitability
- Industry trends and innovations
- Sustainability in cleaning operations
- Parts and accessories for cleaning equipment

RESPONSE REQUIREMENTS:
- Return a valid JSON object matching the exact schema
- All fields are REQUIRED (use empty strings for optional values)
- featuredImage must be a string (use the most appropriate image URL or empty string)
- imagePlacements must be an array with strategic positions based on image analysis
- In the HTML content, you MUST use the exact image URLs provided in <img> tags with Tailwind CSS classes
- Ensure all HTML elements have appropriate Tailwind CSS classes for styling
`;
}

function buildHumanMessage(prompt: string, images: ImageData[]): HumanMessage {
  // Start with text content
  const content: any[] = [
    {
      type: "text" as const,
      text: `Create a comprehensive blog post about: "${prompt}" using Tailwind CSS classes for all styling.`
    }
  ];

  // Add image URLs as multimodal content
  if (images.length > 0) {
    content.push({
      type: "text" as const,
      text: `\n\nANALYZE THESE ${images.length} IMAGES AND INTEGRATE THEM INTO THE CONTENT USING THE EXACT URLs WITH TAILWIND CSS:`
    });

    images.forEach((image, index) => {
      content.push({
        type: "image_url" as const,
        image_url: {
          url: image.url
        }
      });
      
      // Add image context as text with explicit URL instruction
      content.push({
        type: "text" as const,
        text: `Image ${index + 1} - USE THIS EXACT URL: ${image.url}\nDescription: ${image.description || ''}\nAlt Text: ${image.altText || ''}\n\nIMPORTANT: You must use this exact URL in an <img> tag with Tailwind CSS classes in your HTML content.`
      });
    });

    content.push({
      type: "text" as const,
      text: `\n\nCRITICAL INSTRUCTION: In your HTML content, you MUST use the exact image URLs provided above in <img> tags with Tailwind CSS classes. For example: 
<div class="flex flex-col items-center my-8">
  <img src="${images[0].url}" alt="descriptive alt text" class="w-full h-auto rounded-lg shadow-md max-w-2xl mx-auto">
  <p class="text-sm text-gray-600 mt-2 text-center italic">Your descriptive caption here</p>
</div>`
    });
  }

  content.push({
    type: "text" as const,
    text: `\n\nReturn your response as a valid JSON object matching the required schema. Use Tailwind CSS classes throughout your HTML content for consistent styling. Analyze the images carefully and place them where they add the most value to the content, using the exact URLs provided with proper Tailwind styling.`
  });

  return new HumanMessage({
    content
  });
}

function getWordCount(length: string): string {
  const counts = {
    short: "300-500 words",
    medium: "500-800 words", 
    long: "800-1200 words"
  };
  return counts[length as keyof typeof counts] || "500-800 words";
}

function ensureRequiredFields(response: any, images: ImageData[]) {
  // Ensure all required fields have values
  const result = {
    title: response.title || 'AI Generated Blog Post',
    content: response.content || '<div class="prose prose-lg max-w-none"><p>Content generation in progress...</p></div>',
    excerpt: response.excerpt || 'Professional insights for the cleaning industry...',
    tags: Array.isArray(response.tags) ? response.tags : ['ai-generated', 'industry-insights'],
    seoTitle: response.seoTitle || response.title || 'AI Generated Blog Post',
    seoDescription: response.seoDescription || response.excerpt || 'Professional insights for the cleaning industry...',
    featuredImage: response.featuredImage || (images.length > 0 ? images[0].url : ''),
    imagePlacements: Array.isArray(response.imagePlacements) ? response.imagePlacements : generateImagePlacements(images, '')
  };

  // Ensure Tailwind classes are present in content
  if (!result.content.includes('class="') && !result.content.includes("class='")) {
    result.content = result.content.replace(
      '<div>', 
      '<div class="prose prose-lg max-w-none">'
    );
  }

  // Log the generated content to verify image URLs and Tailwind classes
  console.log('Generated content preview:', {
    title: result.title,
    contentLength: result.content.length,
    hasImages: result.content.includes('<img'),
    hasTailwindClasses: result.content.includes('class='),
    featuredImage: result.featuredImage,
    imagePlacements: result.imagePlacements
  });

  return result;
}

async function generateFallbackContent(
  model: ChatOpenAI,
  prompt: string,
  images: ImageData[],
  tone: string,
  length: string,
  category: string
) {
  try {
    console.log('Using fallback content generation...');
    
    const systemMessage = new SystemMessage(buildSystemPrompt({ tone, length, category, images }));
    const humanMessage = buildHumanMessage(prompt, images);

    const response = await model.invoke([systemMessage, humanMessage]);

    const content = response.content.toString();
    console.log('Fallback response received');

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return ensureRequiredFields(parsed, images);
      } catch (parseError) {
        console.log('JSON parsing failed, using text analysis');
      }
    }

    // If no JSON found, create structured data from text
    return createStructuredDataFromText(content, images, prompt);
    
  } catch (error) {
    console.error('Fallback also failed:', error);
    return createDefaultStructuredData(images, prompt);
  }
}

function createStructuredDataFromText(content: string, images: ImageData[], prompt: string) {
  const title = extractTitle(content) || `AI Generated: ${prompt.slice(0, 50)}...`;
  const excerpt = extractExcerpt(content) || `Professional insights about ${prompt.slice(0, 100)}...`;
  
  // Ensure images are included in the content with Tailwind CSS
  let formattedContent = content;
  if (images.length > 0 && !content.includes('<img')) {
    // Add images to the content with Tailwind classes
    const imageSections = images.map((image, index) => `
      <div class="flex flex-col items-center my-8">
        <img src="${image.url}" alt="${image.altText}" class="w-full h-auto rounded-lg shadow-md max-w-2xl mx-auto">
        ${image.description ? `<p class="text-sm text-gray-600 mt-2 text-center italic">${image.description}</p>` : ''}
      </div>
    `).join('\n');
    
    formattedContent = formattedContent.replace('</div>', `${imageSections}</div>`);
  }
  
  return {
    title,
    content: formatContent(formattedContent, images),
    excerpt,
    tags: generateTags(content),
    seoTitle: title,
    seoDescription: excerpt,
    featuredImage: images.length > 0 ? images[0].url : '',
    imagePlacements: generateImagePlacements(images, content)
  };
}

function extractTitle(content: string): string {
  const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  if (titleMatch) return titleMatch[1].replace(/<[^>]*>/g, '').trim();
  
  const titleLine = content.split('\n').find(line => line.trim().length > 0);
  return titleLine ? titleLine.replace(/<[^>]*>/g, '').slice(0, 60).trim() + '...' : '';
}

function extractExcerpt(content: string): string {
  const paragraphMatch = content.match(/<p[^>]*>(.*?)<\/p>/);
  if (paragraphMatch) {
    return paragraphMatch[1].replace(/<[^>]*>/g, '').slice(0, 160).trim() + '...';
  }
  return content.replace(/<[^>]*>/g, '').slice(0, 160).trim() + '...';
}

function formatContent(content: string, images: ImageData[]): string {
  let formattedContent = content;
  
  // Ensure content is wrapped in proper Tailwind container
  if (!content.includes('class="prose')) {
    formattedContent = `<div class="prose prose-lg max-w-none">\n${content}\n</div>`;
  }
  
  // Add Tailwind image styling if not present
  if (content.includes('<img') && !content.includes('class=')) {
    formattedContent = formattedContent.replace(
      /<img([^>]*)>/g, 
      '<img$1 class="w-full h-auto rounded-lg shadow-md mx-auto my-6">'
    );
  }
  
  // Ensure proper container for images with captions
  if (content.includes('<img') && !content.includes('flex flex-col')) {
    formattedContent = formattedContent.replace(
      /<img([^>]*)>\s*(<p[^>]*>.*?<\/p>)?/g,
      (match, imgAttrs, caption) => {
        if (caption) {
          return `<div class="flex flex-col items-center my-8">
            <img${imgAttrs} class="w-full h-auto rounded-lg shadow-md max-w-2xl mx-auto">
            ${caption.replace('text-center', 'text-center italic').replace('<p', '<p class="text-sm text-gray-600 mt-2 text-center italic"')}
          </div>`;
        } else {
          return `<div class="flex flex-col items-center my-8">
            <img${imgAttrs} class="w-full h-auto rounded-lg shadow-md max-w-2xl mx-auto">
          </div>`;
        }
      }
    );
  }
  
  return formattedContent;
}

function generateTags(content: string): string[] {
  const baseTags = ['ai-generated', 'industry-insights', 'professional-advice'];
  const contentLower = content.toLowerCase();
  
  // Add relevant tags based on content
  if (contentLower.includes('laundry')) baseTags.push('laundry-equipment');
  if (contentLower.includes('dry clean')) baseTags.push('dry-cleaning');
  if (contentLower.includes('maintenance')) baseTags.push('maintenance-tips');
  if (contentLower.includes('business')) baseTags.push('business-advice');
  if (contentLower.includes('machine')) baseTags.push('machinery');
  if (contentLower.includes('sustainability')) baseTags.push('sustainability');
  
  return baseTags;
}

function generateImagePlacements(images: ImageData[], content: string): Array<{
  imageUrl: string;
  position: number;
  caption: string;
  altText: string;
}> {
  return images.map((image, index) => ({
    imageUrl: image.url,
    position: (index + 1) * 2,
    caption: image.description || `Commercial cleaning equipment ${index + 1}`,
    altText: image.altText || `Image of ${image.description || 'industry equipment'} for laundry and dry cleaning operations`
  }));
}

function createDefaultStructuredData(images: ImageData[], prompt: string) {
  const baseTitle = `AI Generated: ${prompt.slice(0, 50)}...`;
  
  // Include images in default content with Tailwind CSS
  const imageContent = images.length > 0 ? images.map(image => `
    <div class="flex flex-col items-center my-8">
      <img src="${image.url}" alt="${image.altText}" class="w-full h-auto rounded-lg shadow-md max-w-2xl mx-auto">
      ${image.description ? `<p class="text-sm text-gray-600 mt-2 text-center italic">${image.description}</p>` : ''}
    </div>
  `).join('\n') : '';
  
  return {
    title: baseTitle,
    content: `<div class="prose prose-lg max-w-none">
      <h1>${baseTitle}</h1>
      <p class="mb-4">This comprehensive article explores ${prompt} in the commercial laundry and dry cleaning industry.</p>
      ${imageContent}
      <p class="mb-4">Our experts provide valuable insights and practical advice for industry professionals.</p>
      <h2 class="mt-8 mb-4">Key Industry Insights</h2>
      <p class="mb-4">Discover the latest trends and best practices that can help optimize your operations.</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Equipment maintenance best practices</li>
        <li>Operational efficiency strategies</li>
        <li>Industry innovation updates</li>
      </ul>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r">
        <p class="mb-0"><strong>Pro Tip:</strong> Regular maintenance can extend equipment lifespan by up to 40%.</p>
      </div>
    </div>`,
    excerpt: `Professional insights and analysis about ${prompt} in the laundry and dry cleaning industry.`,
    tags: ['ai-generated', 'industry-insights', 'professional-advice', 'cleaning-equipment'],
    seoTitle: baseTitle,
    seoDescription: `Expert analysis and insights about ${prompt} for commercial laundry and dry cleaning operations.`,
    featuredImage: images.length > 0 ? images[0].url : '',
    imagePlacements: generateImagePlacements(images, '')
  };
}