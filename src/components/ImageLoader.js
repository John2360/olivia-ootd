import React, { useState } from 'react';

const ImageLoader = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className='post-image'>
      {isLoading && <Spinner />}
      <img
        src={src}
        alt={alt}
        style={{ display: isLoading ? 'none' : 'block' }}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

const Spinner = () => {
  // Implement your spinner component
  return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
};

export default ImageLoader;