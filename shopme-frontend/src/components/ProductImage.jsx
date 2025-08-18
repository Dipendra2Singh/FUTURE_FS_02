import React, { useState } from 'react';

const ProductImage = ({ src, alt, className = "w-full h-48 object-cover" }) => {
  const [imageError, setImageError] = useState(false);
  
  // Generate placeholder based on product name
  const generatePlaceholder = (name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500'];
    const colorIndex = name.length % colors.length;
    const initials = name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    
    return (
      <div className={`${className} ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-2xl`}>
        {initials}
      </div>
    );
  };

  if (imageError) {
    return generatePlaceholder(alt);
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default ProductImage;