"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "File tidak ditemukan" };
    }

    // Hanya terima image
    if (!file.type.startsWith("image/")) {
      return { error: "File harus berupa gambar" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Konversi gambar ke webp untuk performa terbaik
    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Generate nama unik untuk menghindari konflik
    const fileId = crypto.randomBytes(8).toString("hex");
    const fileName = `uploads/${Date.now()}-${fileId}.webp`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: optimizedBuffer,
      ContentType: "image/webp",
    });

    await s3Client.send(command);

    // Menggabungkan dengan URL Publik R2
    const publicUrl = process.env.R2_PUBLIC_URL?.endsWith("/") 
      ? process.env.R2_PUBLIC_URL 
      : `${process.env.R2_PUBLIC_URL}/`;
      
    const fileUrl = `${publicUrl}${fileName}`;

    return { success: true, url: fileUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Terjadi kesalahan saat upload gambar" };
  }
}
