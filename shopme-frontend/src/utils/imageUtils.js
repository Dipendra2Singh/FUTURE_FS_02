// Auto-generate placeholder images using external service
export const getProductImage = (imagePath, productName) => {
  // If image exists, use it
  if (imagePath && !imagePath.includes('placeholder')) {
    return imagePath;
  }
  
  // Generate placeholder using external service
  const encodedName = encodeURIComponent(productName);
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F'];
  const bgColor = colors[productName.length % colors.length];
  
  return `https://via.placeholder.com/400x300/${bgColor}/FFFFFF?text=${encodedName}`;
};

// Alternative: Use Unsplash for real product images
export const getUnsplashImage = (productName, width = 400, height = 300) => {
  const query = productName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '+');
  return `https://source.unsplash.com/${width}x${height}/?${query}`;
};

// Generate initials placeholder
export const getInitialsPlaceholder = (productName) => {
  const initials = productName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['3B82F6', '10B981', '8B5CF6', 'EF4444', 'F59E0B', 'EC4899'];
  const bgColor = colors[productName.length % colors.length];
  
  return `https://via.placeholder.com/400x300/${bgColor}/FFFFFF?text=${initials}&font-size=48`;
};