'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Star, ImagePlus, Loader2, MoveLeft, MoveRight } from 'lucide-react';
import { uploadMedia } from '@/lib/admin-api';

export interface ProductImageItem {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

interface ProductImageDropzoneProps {
  images: ProductImageItem[];
  onImagesChange: (images: ProductImageItem[]) => void;
  folder?: string;
  maxFiles?: number;
}

export const ProductImageDropzone: React.FC<ProductImageDropzoneProps> = ({
  images,
  onImagesChange,
  folder = 'rangoli-fashions/products',
  maxFiles = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = file.name ? file.name.substring(file.name.lastIndexOf('.')).toLowerCase() : '';
      const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.jfif', '.pjpeg', '.avif'].includes(ext);
      if (file.type.startsWith('image/') || isImageExt) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    if (images.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    const newUploaded: ProductImageItem[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}...`);
      try {
        const res = await uploadMedia(validFiles[i], folder);
        if (res) {
          newUploaded.push({
            url: res.url,
            publicId: res.publicId,
            isPrimary: images.length === 0 && newUploaded.length === 0,
          });
        }
      } catch (err: any) {
        console.error('Image upload failed:', err);
      }
    }

    if (newUploaded.length > 0) {
      onImagesChange([...images, ...newUploaded]);
    }

    setIsUploading(false);
    setUploadProgress('');
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    // If the removed image was primary, set the first remaining image as primary
    if (images[index]?.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    onImagesChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }));
    // Also move the primary image to the first slot for consistency
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onImagesChange(updated);
  };

  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    // Update isPrimary based on new positions
    reordered.forEach((img, idx) => {
      img.isPrimary = idx === 0;
    });
    onImagesChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#003D2D] bg-[#003D2D]/10 ring-4 ring-[#C9A34A]/40 scale-[1.01]'
            : 'border-[#C9A34A] hover:border-[#003D2D] bg-[#FAF6F0]/60 hover:bg-[#FFF8ED]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          {isUploading ? (
            <>
              <Loader2 size={32} className="text-[#003D2D] animate-spin" />
              <p className="text-xs font-semibold text-[#003D2D]">{uploadProgress || 'Uploading...'}</p>
              <p className="text-[11px] text-[#746D62]">Optimizing and storing image...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center">
                <Upload size={22} className={isDragging ? 'animate-bounce' : ''} />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-[#191714]">
                  {isDragging ? 'Drop images to upload!' : 'Drag & drop product images here, or browse'}
                </p>
                <p className="text-[11px] text-[#746D62]">
                  Supports PNG, JPG, JPEG, WEBP. Drag multiple images at once (up to {maxFiles} total).
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Uploaded Images Gallery Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#191714]">
              Uploaded Images ({images.length} / {maxFiles})
            </span>
            <span className="text-[11px] text-[#746D62]">
              The first image is the default product cover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.publicId || idx}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 bg-[#FAF6F0] shadow-xs group transition-all ${
                  idx === 0 ? 'border-[#003D2D] ring-2 ring-[#C9A34A]/50' : 'border-[#E8DFD0]'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Product Image ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover"
                />

                {/* Cover Badge */}
                {idx === 0 ? (
                  <span className="absolute top-2 left-2 bg-[#003D2D] text-[#FFF8ED] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
                    <Star size={10} className="fill-[#C9A34A] text-[#C9A34A]" />
                    <span>COVER</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(idx);
                    }}
                    className="absolute top-2 left-2 bg-black/60 hover:bg-[#003D2D] text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Make this the primary cover image"
                  >
                    Set Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>

                {/* Reorder Buttons (Move Left / Move Right) */}
                <div className="absolute bottom-2 inset-x-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveImage(idx, idx - 1);
                    }}
                    className="p-1 bg-black/70 hover:bg-black text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move left"
                  >
                    <MoveLeft size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveImage(idx, idx + 1);
                    }}
                    className="p-1 bg-black/70 hover:bg-black text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move right"
                  >
                    <MoveRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

