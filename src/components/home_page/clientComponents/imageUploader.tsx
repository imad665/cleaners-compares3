'use client'
import React, { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(previews);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border rounded-xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Product Images</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img.preview}
              alt={`upload-${index}`}
              className="rounded-lg w-full h-24 object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs hidden group-hover:block"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
