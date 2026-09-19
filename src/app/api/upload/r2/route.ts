import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getR2Client(): { client: S3Client; bucketName: string; publicUrl: string } | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    return null;
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client, bucketName, publicUrl };
}

function safeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '') || 'photo';
}

/**
 * Health & Configuration status check for Cloudflare R2
 */
export async function GET() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  const isConfigured = Boolean(
    accountId &&
    accessKeyId &&
    process.env.R2_SECRET_ACCESS_KEY &&
    bucketName &&
    publicUrl
  );

  return NextResponse.json({
    configured: isConfigured,
    provider: 'cloudflare-r2',
    bucketName: bucketName || null,
    publicUrl: publicUrl ? publicUrl.replace(/\/$/, '') : null,
    accountIdMasked: accountId ? `${accountId.substring(0, 4)}...${accountId.slice(-4)}` : null,
  });
}

/**
 * Upload a photo file to Cloudflare R2 Object Storage
 */
export async function POST(request: Request) {
  const r2 = getR2Client();

  if (!r2) {
    return NextResponse.json(
      {
        error: 'Cloudflare R2 is not configured on the server. Please check your environment variables (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL).',
        configured: false,
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const eventId = String(formData.get('eventId') || 'general');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'An image file is required.' }, { status: 400 });
    }

    // Generate clean object key path
    const sanitizedEventId = safeFileName(eventId);
    const sanitizedFileName = safeFileName(file.name);
    const key = `events/${sanitizedEventId}/${Date.now()}-${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2 bucket with immutable CDN cache headers
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucketName,
        Key: key,
        Body: body,
        ContentType: file.type || 'image/jpeg',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const publicUrlBase = r2.publicUrl.replace(/\/$/, '');
    const finalUrl = `${publicUrlBase}/${key}`;

    return NextResponse.json({
      success: true,
      publicUrl: finalUrl,
      key,
      bucket: r2.bucketName,
      sizeBytes: file.size,
      contentType: file.type || 'image/jpeg',
    });
  } catch (error: any) {
    console.error('Cloudflare R2 upload error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Cloudflare R2 upload failed.',
        code: error?.name || 'R2UploadError',
      },
      { status: 500 }
    );
  }
}