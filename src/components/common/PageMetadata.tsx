"use client";

import React, { useEffect } from 'react';

interface PageMetadataProps {
  title: string;
  description: string;
}

const PageMetadata: React.FC<PageMetadataProps> = ({ title, description }) => {
  useEffect(() => {
    // Actualizar el título del documento
    document.title = title;
    
    // Actualizar la meta descripción
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);

  // Este componente no renderiza nada visible
  return null;
};

export default PageMetadata; 