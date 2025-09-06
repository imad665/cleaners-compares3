// components/llm-response/renderer.tsx
import React from 'react';
import Response from './response';
import Carousel from './carousel';
import EngineerCarousel from './engineer-carousel';
import Text from './text';
import Product from './product';
 
import { ProductProps } from './product';
 
import { Bot } from 'lucide-react';
import Engineer, { EngineerProps } from './enginner';

export interface ResponseElement {
  type: 'text' | 'carousel' | 'engineerCarousel';
  content: string | ProductProps[] | EngineerProps[];
}

export function renderLLMResponse(xmlString: string, showIcon: boolean = false): React.ReactNode {
  // Parse XML while preserving order
  const parseXML = (xml: string): ResponseElement[] => {
    const elements: ResponseElement[] = [];
    
    // Extract the content inside Response tags
    const responseRegex = /<Response>(.*?)<\/Response>/gs;
    const responseMatch = responseRegex.exec(xml);
    
    if (!responseMatch) return elements;
    
    const responseContent = responseMatch[1];
    let remainingContent = responseContent.trim();
    
    // Process content in order
    while (remainingContent.length > 0) {
      // Check for text elements first
      const textMatch = /<Text>(.*?)<\/Text>/s.exec(remainingContent);
      // Check for product carousel elements
      const carouselMatch = /<Carousel>(.*?)<\/Carousel>/s.exec(remainingContent);
      // Check for engineer carousel elements
      const engineerCarouselMatch = /<EngineerCarousel>(.*?)<\/EngineerCarousel>/s.exec(remainingContent);
      
      // Determine which comes first
      const textIndex = textMatch ? textMatch.index : Infinity;
      const carouselIndex = carouselMatch ? carouselMatch.index : Infinity;
      const engineerCarouselIndex = engineerCarouselMatch ? engineerCarouselMatch.index : Infinity;
      
      const minIndex = Math.min(textIndex, carouselIndex, engineerCarouselIndex);
      
      if (minIndex === Infinity) break;
      
      if (minIndex === textIndex && textMatch) {
        // Text comes first
        elements.push({
          type: 'text',
          content: textMatch[1].trim()
        });
        remainingContent = remainingContent.slice(textIndex + textMatch[0].length).trim();
      } 
      else if (minIndex === carouselIndex && carouselMatch) {
        // Product carousel comes first
        const carouselContent = carouselMatch[1];
        const products: ProductProps[] = [];
        
        // Extract products from carousel
        const productRegex = /<Product\s+(.*?)\s*\/>/gs;
        let productMatch;
        let productContent = carouselContent;
        
        while ((productMatch = productRegex.exec(productContent)) !== null) {
          const attributesStr = productMatch[1];
          const attrRegex = /(\w+)="(.*?)"/g;
          let attrMatch;
          const attributes: Record<string, string> = {};
          
          while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            attributes[attrMatch[1]] = attrMatch[2];
          }
          
          products.push({
            title: attributes.title || '',
            description: attributes.description || '',
            category: attributes.category || '',
            price: attributes.price || '',
            discount: attributes.discount || '',
            condition: attributes.condition || '',
            stock: attributes.stock || '',
            featured: attributes.featured || '',
            images: attributes.images ? attributes.images.split(',').map(img => img.trim()) : [],
            productId: attributes.productId || `product-${products.length}`
          });
        }
        
        elements.push({
          type: 'carousel',
          content: products
        });
        remainingContent = remainingContent.slice(carouselIndex + carouselMatch[0].length).trim();
      }
      else if (minIndex === engineerCarouselIndex && engineerCarouselMatch) {
        // Engineer carousel comes first
        const engineerCarouselContent = engineerCarouselMatch[1];
        const engineers: EngineerProps[] = [];
        
        // Extract engineers from carousel
        const engineerRegex = /<Engineer\s+(.*?)\s*\/>/gs;
        let engineerMatch;
        let engineerContent = engineerCarouselContent;
        
        while ((engineerMatch = engineerRegex.exec(engineerContent)) !== null) {
          const attributesStr = engineerMatch[1];
          const attrRegex = /(\w+)="(.*?)"/g;
          let attrMatch;
          const attributes: Record<string, string> = {};
          
          while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            attributes[attrMatch[1]] = attrMatch[2];
          }
          
          engineers.push({
            engineerId: attributes.engineerId || `engineer-${engineers.length}`,
            title: attributes.title || '',
            areaOfService: attributes.areaOfService || '',
            experience: attributes.experience || '',
            contactNumber: attributes.contactNumber || '',
            email: attributes.email || '',
            address: attributes.address || '',
            ratePerHour: attributes.ratePerHour || '',
            companyType: attributes.companyType || '',
            pictureUrl: attributes.pictureUrl || '',
            featured: attributes.featured || 'No'
          });
        }
        
        elements.push({
          type: 'engineerCarousel',
          content: engineers
        });
        remainingContent = remainingContent.slice(engineerCarouselIndex + engineerCarouselMatch[0].length).trim();
      }
      else {
        // No more matches, break out
        break;
      }
    }
    
    return elements;
  };

  try {
    const responseElements = parseXML(xmlString);
    
    // Debug: log parsed elements
    console.log('Parsed response elements:', responseElements);
    
    return (
      <div className="w-full">
        <Response>
          {responseElements.map((element, index) => {
            if (element.type === 'text') {
              return (
                <div key={index} className="flex justify-start items-end gap-2 mb-3">
                  {showIcon && (
                    <div className="flex-shrink-0 rounded-full p-2 bg-purple-100 text-purple-600">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                      <p className="text-sm">{element.content as string}</p>
                    </div>
                  </div>
                </div>
              );
            } else if (element.type === 'carousel' && Array.isArray(element.content)) {
              return (
                <Carousel key={index}>
                  {(element.content as ProductProps[]).map((product, productIndex) => (
                    <Product key={productIndex} {...product} />
                  ))}
                </Carousel>
              );
            } else if (element.type === 'engineerCarousel' && Array.isArray(element.content)) {
              return (
                <EngineerCarousel key={index}>
                  {(element.content as EngineerProps[]).map((engineer, engineerIndex) => (
                    <Engineer key={engineerIndex} {...engineer} />
                  ))}
                </EngineerCarousel>
              );
            }
            return null;
          })}
        </Response>
      </div>
    );
  } catch (error) {
    console.error('Error parsing LLM response:', error);
    return (
      <div className="flex justify-start items-end gap-2">
        {showIcon && (
          <div className="flex-shrink-0 rounded-full p-2 bg-purple-100 text-purple-600">
            <Bot className="h-4 w-4" />
          </div>
        )}
        <div className="max-w-[80%]">
          <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
            <p className="text-sm">Sorry, there was an error processing the response.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default renderLLMResponse;