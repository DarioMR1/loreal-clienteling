import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { extname } from "path";

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  // Video
  "video/mp4",
  "video/quicktime",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

@Injectable()
export class UploadsService {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.bucket = this.configService.get<string>("R2_BUCKET_NAME", "loreal-clienteling");
    this.publicUrl = this.configService.get<string>("R2_PUBLIC_URL", "");

    this.s3 = new S3Client({
      region: "auto",
      endpoint: this.configService.get<string>(
        "R2_ENDPOINT",
        "https://<ACCOUNT_ID>.r2.cloudflarestorage.com",
      ),
      credentials: {
        accessKeyId: this.configService.get<string>("R2_ACCESS_KEY_ID", ""),
        secretAccessKey: this.configService.get<string>("R2_SECRET_ACCESS_KEY", ""),
      },
    });
  }

  async upload(
    file: Buffer,
    originalName: string,
    mimeType: string,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `File type "${mimeType}" is not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
      );
    }

    if (file.length > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    const ext = extname(originalName) || this.extFromMime(mimeType);
    const key = `${folder}/${randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return {
      key,
      url: this.buildUrl(key),
    };
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    mimeType: string,
  ): Promise<{ key: string; uploadUrl: string; publicUrl: string }> {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `File type "${mimeType}" is not allowed.`,
      );
    }

    const ext = extname(filename) || this.extFromMime(mimeType);
    const key = `${folder}/${randomUUID()}${ext}`;

    const uploadUrl = await getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: mimeType,
      }),
      { expiresIn: 600 }, // 10 minutes
    );

    return {
      key,
      uploadUrl,
      publicUrl: this.buildUrl(key),
    };
  }

  private buildUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, "")}/${key}`;
    }
    return `https://${this.bucket}.r2.dev/${key}`;
  }

  private extFromMime(mimeType: string): string {
    const map: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
      "application/pdf": ".pdf",
      "video/mp4": ".mp4",
      "video/quicktime": ".mov",
    };
    return map[mimeType] ?? "";
  }
}
