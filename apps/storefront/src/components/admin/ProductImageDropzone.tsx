'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Star, ImagePlus, Loader2, RefreshCw } from 'lucide-react';
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
  maxFiles = 5,
}) => {
  const [activeSlotUploading, setActiveSlotUploading] = useState<number | 'bulk' | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | 'bulk' | null>(null);

  // Hidden file inputs for individual slots
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const subInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const bulkInputRef = useRef<HTMLInputElement>(null);

  // Slot 0 is Primary Image
  // Slots 1, 2, 3, 4 are Sub Images
  const primaryImage = images.length > 0 ? images[0] : null;
  const subImages = [
    images[1] || null,
    images[2] || null,
    images[3] || null,
    images[4] || null,
  ];

  const uploadSingleFileToSlot = async (file: File, slotIndex: number) => {
    setActiveSlotUploading(slotIndex);
    try {
      const res = await uploadMedia(file, folder);
      if (res) {
        const currentList = [...images];
        const newItem: ProductImageItem = {
          url: res.url,
          publicId: res.publicId,
          isPrimary: slotIndex === 0,
        };

        if (slotIndex === 0) {
          // Setting or replacing primary image
          if (currentList.length > 0) {
            currentList[0] = { ...newItem, isPrimary: true };
          } else {
            currentList.push(newItem);
          }
        } else {
          // Setting or replacing a sub-image at slotIndex
          // Ensure slots up to slotIndex exist
          while (currentList.length < slotIndex) {
            currentList.push({ url: '', publicId: '', isPrimary: false });
          }
          currentList[slotIndex] = newItem;
        }

        // Clean any empty placeholder entries while preserving valid images
        const sanitized = currentList.filter((img) => Boolean(img?.url));
        // Ensure first image is marked as primary
        sanitized.forEach((img, idx) => {
          img.isPrimary = idx === 0;
        });

        onImagesChange(sanitized);
      }
    } catch (err) {
      console.error('Failed to upload image slot:', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setActiveSlotUploading(null);
    }
  };

  const handleBulkFiles = async (fileList: FileList | File[]) => {
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

    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) {
      alert('All 5 image slots (1 Primary + 4 Sub-images) are already filled.');
      return;
    }

    const filesToUpload = validFiles.slice(0, availableSlots);
    setActiveSlotUploading('bulk');

    const newUploaded: ProductImageItem[] = [];
    for (let i = 0; i < filesToUpload.length; i++) {
      try {
        const res = await uploadMedia(filesToUpload[i], folder);
        if (res) {
          newUploaded.push({
            url: res.url,
            publicId: res.publicId,
            isPrimary: images.length === 0 && newUploaded.length === 0,
          });
        }
      } catch (err) {
        console.error('Bulk upload file error:', err);
      }
    }

    if (newUploaded.length > 0) {
      const merged = [...images, ...newUploaded].slice(0, 5);
      merged.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });
      onImagesChange(merged);
    }

    setActiveSlotUploading(null);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0 || !images[index]) return;
    const reordered = [...images];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);
    reordered.forEach((img, idx) => {
      img.isPrimary = idx === 0;
    });
    onImagesChange(reordered);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    if (updated.length > 0) {
      updated.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });
    }
    onImagesChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        ref={primaryInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            uploadSingleFileToSlot(e.target.files[0], 0);
            e.target.value = '';
          }
        }}
      />
      {subInputRefs.map((ref, idx) => (
        <input
          key={idx}
          ref={ref}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              uploadSingleFileToSlot(e.target.files[0], idx + 1);
              e.target.value = '';
            }
          }}
        />
      ))}
      <input
        ref={bulkInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleBulkFiles(e.target.files);
            e.target.value = '';
          }
        }}
      />

      {/* Main Container: 1 Primary Image Slot + 4 Sub-Image Slots */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* PRIMARY IMAGE SLOT (Cover / Main Angle) */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003D2D] flex items-center space-x-1.5">
              <Star size={14} className="fill-[#C9A34A] text-[#C9A34A]" />
              <span>Primary Image</span>
            </span>
            <span className="text-[10px] font-semibold text-[#C9A34A] bg-[#003D2D] px-2 py-0.5 rounded">
              MAIN COVER
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverSlot(0);
            }}
            onDragLeave={() => setDragOverSlot(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverSlot(null);
              if (e.dataTransfer.files?.[0]) {
                uploadSingleFileToSlot(e.dataTransfer.files[0], 0);
              }
            }}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center bg-[#FAF6F0] ${
              dragOverSlot === 0
                ? 'border-[#003D2D] ring-4 ring-[#C9A34A]/40 scale-[1.01]'
                : primaryImage
                ? 'border-[#C9A34A] shadow-md ring-1 ring-[#C9A34A]/30'
                : 'border-dashed border-[#C9A34A] hover:border-[#003D2D] hover:bg-[#FFF8ED]'
            }`}
          >
            {activeSlotUploading === 0 ? (
              <div className="flex flex-col items-center space-y-2 p-4 text-center">
                <Loader2 size={32} className="text-[#003D2D] animate-spin" />
                <p className="text-xs font-semibold text-[#003D2D]">Uploading Primary Image...</p>
              </div>
            ) : primaryImage ? (
              <div className="relative w-full h-full group">
                <Image
                  src={primaryImage.url}
                  alt="Primary Product Cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />

                {/* Cover Tag */}
                <div className="absolute top-2.5 left-2.5 bg-[#003D2D] text-[#FFF8ED] text-[10px] font-bold px-2 py-1 rounded shadow flex items-center space-x-1">
                  <Star size={11} className="fill-[#C9A34A] text-[#C9A34A]" />
                  <span>PRIMARY</span>
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => primaryInputRef.current?.click()}
                    className="p-1.5 bg-black/70 hover:bg-[#003D2D] text-white rounded-md shadow text-xs"
                    title="Replace Primary Image"
                  >
                    <RefreshCw size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(0)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow text-xs"
                    title="Remove Image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => primaryInputRef.current?.click()}
                    className="w-full py-1.5 bg-black/80 hover:bg-black text-white text-xs font-medium rounded shadow flex items-center justify-center space-x-1"
                  >
                    <RefreshCw size={12} />
                    <span>Change Primary Image</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => primaryInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer space-y-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#191714]">Add Primary Cover Image</p>
                  <p className="text-[11px] text-[#746D62] mt-0.5">Click or drag photo here</p>
                </div>
                <span className="text-[10px] text-[#C9A34A] font-semibold bg-[#FFF8ED] px-2 py-0.5 rounded border border-[#C9A34A]/40">
                  Required for catalog display
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 4 SUB-IMAGE SLOTS */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#191714]">
                Sub-Images (4 Additional Angles / Close-ups)
              </span>
              <p className="text-[11px] text-[#746D62]">
                Upload fabric details, back angle, side angle, or model shots. Click &quot;Make Primary&quot; to swap.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#003D2D]">
              {images.length > 1 ? images.length - 1 : 0} / 4 Added
            </span>
          </div>

          {/* 4 Sub-image Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((slotIdx) => {
              const imageIndex = slotIdx + 1;
              const subImg = subImages[slotIdx];
              const isUploadingThisSlot = activeSlotUploading === imageIndex;
              const isOverThisSlot = dragOverSlot === imageIndex;

              return (
                <div key={slotIdx} className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#746D62]">
                    <span>Sub-Image {slotIdx + 1}</span>
                  </div>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverSlot(imageIndex);
                    }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      if (e.dataTransfer.files?.[0]) {
                        uploadSingleFileToSlot(e.dataTransfer.files[0], imageIndex);
                      }
                    }}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all flex flex-col items-center justify-center bg-[#FAF6F0] ${
                      isOverThisSlot
                        ? 'border-[#003D2D] ring-2 ring-[#C9A34A]/40 scale-[1.02]'
                        : subImg
                        ? 'border-[#E8DFD0] shadow-xs'
                        : 'border-dashed border-[#E8DFD0] hover:border-[#003D2D] hover:bg-[#FFF8ED]'
                    }`}
                  >
                    {isUploadingThisSlot ? (
                      <div className="flex flex-col items-center space-y-1.5 p-2 text-center">
                        <Loader2 size={22} className="text-[#003D2D] animate-spin" />
                        <p className="text-[10px] font-semibold text-[#003D2D]">Uploading...</p>
                      </div>
                    ) : subImg ? (
                      <div className="relative w-full h-full group">
                        <Image
                          src={subImg.url}
                          alt={`Sub Image ${slotIdx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 20vw"
                          className="object-cover"
                        />

                        {/* Make Primary Button */}
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(imageIndex)}
                          className="absolute top-1.5 left-1.5 bg-[#003D2D]/90 hover:bg-[#003D2D] text-[#DFC37A] text-[9px] font-bold px-1.5 py-1 rounded shadow-sm opacity-90 group-hover:opacity-100 transition-opacity flex items-center space-x-1"
                          title="Make this the Primary Cover Image"
                        >
                          <Star size={10} className="fill-[#C9A34A]" />
                          <span>Make Primary</span>
                        </button>

                        {/* Action Buttons */}
                        <div className="absolute top-1.5 right-1.5 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => subInputRefs[slotIdx].current?.click()}
                            className="p-1 bg-black/70 hover:bg-[#003D2D] text-white rounded shadow text-[10px]"
                            title="Replace Image"
                          >
                            <RefreshCw size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imageIndex)}
                            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded shadow text-[10px]"
                            title="Remove Image"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => subInputRefs[slotIdx].current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center p-3 text-center cursor-pointer space-y-1.5 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#003D2D]/5 text-[#003D2D] flex items-center justify-center group-hover:bg-[#003D2D]/10 transition-colors">
                          <ImagePlus size={16} />
                        </div>
                        <span className="text-[11px] font-medium text-[#191714]">
                          + Sub-Image {slotIdx + 1}
                        </span>
                        <span className="text-[9px] text-[#746D62]">Click to upload</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bulk Dropzone Quick Option */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverSlot('bulk');
            }}
            onDragLeave={() => setDragOverSlot(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverSlot(null);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleBulkFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => activeSlotUploading === null && bulkInputRef.current?.click()}
            className={`mt-4 border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
              dragOverSlot === 'bulk'
                ? 'border-[#003D2D] bg-[#003D2D]/10 ring-2 ring-[#C9A34A]/40'
                : 'border-[#E8DFD0] hover:border-[#003D2D] bg-[#FAF6F0]/60 hover:bg-[#FFF8ED]'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 text-xs text-[#746D62]">
              {activeSlotUploading === 'bulk' ? (
                <>
                  <Loader2 size={16} className="text-[#003D2D] animate-spin" />
                  <span className="font-semibold text-[#003D2D]">Uploading images...</span>
                </>
              ) : (
                <>
                  <Upload size={14} className="text-[#003D2D]" />
                  <span>
                    Or <strong className="text-[#003D2D]">drag & drop multiple images</strong> at once to auto-fill slots
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
