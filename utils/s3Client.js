import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION_,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_,
  },
});

export default s3Client;