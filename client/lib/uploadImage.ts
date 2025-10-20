/**
 * Shared image upload utility for Cloudinary
 * Supports single and multiple image uploads with validation
 */

const CLOUDINARY_UPLOAD_PRESET = "blog_images";
const CLOUDINARY_CLOUD_NAME = "dewxaup4t";

export interface UploadOptions {
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export interface UploadResult {
    url: string;
    publicId: string;
    width: number;
    height: number;
}

/**
 * Upload a single image to Cloudinary
 * @param file - The file to upload
 * @param options - Upload options (maxSizeMB, allowedTypes)
 * @returns Promise with the uploaded image URL and metadata
 */
export async function uploadImage(
    file: File,
    options: UploadOptions = {}
): Promise<UploadResult> {
    const { maxSizeMB = 5, allowedTypes = ['image/'] } = options;

    // Validate file type
    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isValidType) {
        throw new Error(`${file.name} is not a valid image file`);
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        throw new Error(`${file.name} is too large. Maximum size is ${maxSizeMB}MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
    }

    const data = await response.json();

    return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
    };
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Promise with array of uploaded image URLs and metadata
 */
export async function uploadImages(
    files: File[],
    options: UploadOptions = {}
): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => uploadImage(file, options));
    return Promise.all(uploadPromises);
}

/**
 * Upload image from a data URL (useful for cropped images)
 * @param dataUrl - Base64 data URL
 * @param filename - Optional filename
 * @returns Promise with the uploaded image URL and metadata
 */
export async function uploadImageFromDataUrl(
    dataUrl: string,
    filename: string = 'upload.png'
): Promise<UploadResult> {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });

    return uploadImage(file);
}
