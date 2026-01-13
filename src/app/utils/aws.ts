import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';
export const s3Client = new S3Client({
  region: `${config.storage.region}`,
  endpoint: `https://${config.storage.region}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: `${config.storage.accessKeyId}`,
    secretAccessKey: `${config.storage.secretAccessKey}`,
  },
});
