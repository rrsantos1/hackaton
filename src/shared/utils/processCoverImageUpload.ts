import { FastifyRequest } from "fastify";
import fs from "fs";
import path from "path";

export async function processCoverImageUpload(request: FastifyRequest) {
  const parts = request.parts();

  let coverImageUrl: string | undefined;
  const fields: Record<string, any> = {};

  for await (const part of parts) {
    if (part.type === "file") {
      const uploadDir = path.join(__dirname, "..", "..", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, part.filename);
      const writeStream = fs.createWriteStream(filePath);
      await part.file.pipe(writeStream);

      coverImageUrl = `/uploads/${part.filename}`;
    } else if (part.type === "field") {
      fields[part.fieldname] = part.value;
    }
  }

  return { fields, coverImageUrl };
}