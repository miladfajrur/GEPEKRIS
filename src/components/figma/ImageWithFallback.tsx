import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
  className,
  ...props
}) => {
  const validSrc = (src && typeof src === 'string' && src.trim() !== '') ? src.trim() : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(validSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  // Synchronize when the src or fallbackSrc prop changes
  useEffect(() => {
    const nextSrc = (src && typeof src === 'string' && src.trim() !== '') ? src.trim() : fallbackSrc;
    setImgSrc(nextSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <img
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt || "Church image"}
      className={className}
      onError={() => {
        if (!hasError && imgSrc !== fallbackSrc) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

