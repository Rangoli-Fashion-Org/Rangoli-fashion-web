import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private isCloudinaryConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isCloudinaryConfigured = true;
      this.logger.log('Cloudinary successfully initialized');
    } else {
      this.logger.warn('Cloudinary credentials not provided; using local storage fallback for development');
    }
  }

  async uploadFile(file: Express.Multer.File, folder = 'rangoli-fashions') {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate mime types: jpeg, jpg, png, webp, svg
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, WEBP, and SVG image files are allowed');
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size exceeds 5MB limit');
    }

    if (this.isCloudinaryConfigured) {
      return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) {
              this.logger.error('Cloudinary upload error', error);
              return reject(new BadRequestException('Failed to upload image to Cloudinary'));
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          },
        );
        uploadStream.end(file.buffer);
      });
    }

    // Local storage fallback
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const backendUrl = this.configService.get<string>('API_URL') || 'http://localhost:4000';
    const fileUrl = `${backendUrl}/api/v1/uploads/${filename}`;

    return {
      url: fileUrl,
      publicId: `local_${filename}`,
    };
  }

  async deleteFile(publicId: string) {
    if (publicId.startsWith('local_')) {
      const filename = publicId.replace('local_', '');
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { success: true };
    }

    if (this.isCloudinaryConfigured) {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    }

    return { success: true };
  }
}

