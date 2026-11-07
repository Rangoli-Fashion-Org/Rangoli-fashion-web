'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImagePlus, Check } from 'lucide-react';
import { uploadMedia } from '@/lib/admin-api';

interface ImageDropzoneProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
  aspectRatio?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  value,
  onChange,
  folder = 'rangoli-fashions',
  label = 'Image',
  helperText = 'Drag & drop image here, or click to browse (JPG, PNG, WEBP)',
  aspectRatio = 'aspect-[16/9]',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await uploadMedia(file, folder);
      if (res?.url) {
        onChange(res.url);
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5 text-xs">
      {label && <label className="block text-[#191714] font-medium">{label}</label>}

      {value ? (
        // Preview with replace/remove controls
        <div className={`relative w-full ${aspectRatio} max-h-64 rounded-xl overflow-hidden border-2 border-[#003D2D] bg-[#FAF6F0] group shadow-xs`}>
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[#191714] font-semibold text-[11px] rounded-lg shadow hover:bg-neutral-100 flex items-center space-x-1"
            >
              <ImagePlus size={13} />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
              title="Remove Image"
            >
              <X size={15} />
            </button>
          </div>
          <span className="absolute bottom-2 left-2 bg-[#003D2D]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow flex items-center space-x-1">
            <Check size={10} className="text-[#C9A34A]" />
            <span>Uploaded</span>
          </span>
        </div>
      ) : (
        // Dropzone Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#003D2D] bg-[#003D2D]/10 ring-4 ring-[#C9A34A]/30 scale-[1.01]'
              : 'border-[#C9A34A] hover:border-[#003D2D] bg-[#FAF6F0]/60 hover:bg-[#FFF8ED]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            {isUploading ? (
              <>
                <Loader2 size={26} className="text-[#003D2D] animate-spin" />
                <p className="text-xs font-semibold text-[#003D2D]">Uploading image...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#003D2D]/10 text-[#003D2D] flex items-center justify-center">
                  <Upload size={18} className={isDragging ? 'animate-bounce' : ''} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#191714]">
                    {isDragging ? 'Drop image here to upload' : 'Drag & drop image here, or browse'}
                  </p>
                  <p className="text-[11px] text-[#746D62]">{helperText}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {uploadError && (
        <p className="text-[11px] text-red-600 font-medium">{uploadError}</p>
      )}
    </div>
  );
};
