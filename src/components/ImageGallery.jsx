import React, { useState } from 'react'
import ImageModal from './ImageModal'
import './ImageGallery.css'

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <div className="image-gallery">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="image-gallery-item"
            onClick={() => handleImageClick(image)}
          >
            <img 
              src={image.src} 
              alt={image.alt || image.caption || `Gallery image ${index + 1}`}
              className="image-gallery-thumbnail"
            />
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={handleCloseModal}
          imageSrc={selectedImage.src}
          caption={selectedImage.caption}
        />
      )}
    </>
  )
}

