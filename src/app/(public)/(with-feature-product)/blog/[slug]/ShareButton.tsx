'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Twitter, Facebook, Linkedin, Mail } from "lucide-react";

interface ShareButtonProps {
  post: {
    title: string;
    excerpt: string;
  };
  shareUrl: string;
}

export default function ShareButton({ post, shareUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToSocialMedia = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(post.title);
    const encodedText = encodeURIComponent(post.excerpt);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    };

    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      if (platform === 'email') {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'width=600,height=400');
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      <span className="text-sm text-gray-500 font-medium">Share this article:</span>
      
      <div className="flex flex-wrap gap-2">
        {/* Copy Link Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>

        {/* Twitter */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => shareToSocialMedia('twitter')}
          className="gap-2"
        >
          <Twitter size={16} className="text-blue-400" />
          Twitter
        </Button>

        {/* Facebook */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => shareToSocialMedia('facebook')}
          className="gap-2"
        >
          <Facebook size={16} className="text-blue-600" />
          Facebook
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => shareToSocialMedia('linkedin')}
          className="gap-2"
        >
          <Linkedin size={16} className="text-blue-700" />
          LinkedIn
        </Button>

        {/* Email */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => shareToSocialMedia('email')}
          className="gap-2"
        >
          <Mail size={16} className="text-gray-600" />
          Email
        </Button>
      </div>
    </div>
  );
}