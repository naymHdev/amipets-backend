import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import config from '../config';
import path from 'path';
import { s3Client } from './aws';
import AppError from '../errors/appError';
import httpStatus from 'http-status';

//upload a single file
export const uploadToS3 = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { file, fileName }: { file: any; fileName: string },
): Promise<string | null> => {
  const command = new PutObjectCommand({
    Bucket: config.storage.bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  try {
    const key = await s3Client.send(command);
    if (!key) {
      throw new AppError(httpStatus.BAD_REQUEST, 'File Upload failed');
    }

    // const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileName}`;

    // ✅ DigitalOcean Spaces URL format:
    const url = `https://${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.digitaloceanspaces.com/${fileName}`;

    return url;
  } catch (error) {
    console.log('error____', error);
    throw new AppError(httpStatus.BAD_REQUEST, 'File Upload failed');
  }
};

// delete file from s3 bucket
export const deleteFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.log('🚀 ~ deleteFromS3 ~ error:', error);
    throw new Error('s3 file delete failed');
  }
};

// upload multiple files

export const uploadManyToS3 = async (
  files: {
    file: any;
    path: string;
    key?: string;
  }[],
): Promise<{ url: string; key: string }[]> => {
  try {
    const uploadPromises = files.map(
      async ({ file, path: folderPath, key }) => {
        // ✅ Extract original file extension (e.g. .mp3)
        const fileExtension = path.extname(file.originalname);

        // ✅ Generate unique file name with extension
        const newFileName = key
          ? key
          : `${Math.floor(100000 + Math.random() * 900000)}-${Date.now()}${fileExtension}`;

        // ✅ Full key path
        const fileKey = `${folderPath}/${newFileName}`;

        // ✅ Upload command
        const command = new PutObjectCommand({
          Bucket: config.storage.bucket as string,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        });

        await s3Client.send(command);

        // ✅ DigitalOcean Spaces public URL
        const url = `https://${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.digitaloceanspaces.com/${fileKey}`;

        return { url, key: newFileName };
      },
    );

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw new Error('File upload failed');
  }
};
export const deleteManyFromS3 = async (keys: string[]) => {
  try {
    const deleteParams = {
      Bucket: config.storage.bucket,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);

    const response = await s3Client.send(command);

    return response;
  } catch (error) {
    console.error('Error deleting S3 files:', error);
    throw new AppError(httpStatus.BAD_REQUEST, 'S3 file delete failed');
  }
};
