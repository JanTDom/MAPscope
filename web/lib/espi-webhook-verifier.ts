import crypto from "node:crypto";

const DEFAULT_WEBHOOK_SECRET = process.env.ESPI_WEBHOOK_SECRET || "mapscope_knf_espi_secret_key_2026";

export function verifyHmacSignature(
  rawBody: string | Buffer,
  signatureHeader: string,
  secret: string = DEFAULT_WEBHOOK_SECRET
): boolean {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const expectedSig = hmac.digest("hex");

  const bufA = Buffer.from(expectedSig.toLowerCase());
  const bufB = Buffer.from(signatureHeader.toLowerCase().trim());

  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
