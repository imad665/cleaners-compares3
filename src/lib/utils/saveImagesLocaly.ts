"server only"

import path from 'path';
import fs from 'fs/promises';

export async function saveImageFileAt(imageFile: File, directory: string, filename: string) {
  const buffer = await imageFile.arrayBuffer();
  const bytes = Buffer.from(buffer);

  const uploadDir = path.join(process.cwd(), 'public', directory);
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, bytes);

  return {
    success: true,
    message: 'File saved successfully',
    url: `/${directory}/${filename}`, // This is the public path
  };
}

export async function updateImageFileAt(imageFile: File, directory: string, filename: string) {
  const uploadDir = path.join(process.cwd(), 'public', directory);
  const filePath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });

  // Delete old file if exists
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    // File doesn't exist — skip deletion
  }

  // Save new file
  const buffer = await imageFile.arrayBuffer();
  const bytes = Buffer.from(buffer);
  await fs.writeFile(filePath, bytes);

  return {
    success: true,
    message: 'File updated successfully',
    url: `/${directory}/${filename}`, // Public URL
  };
}

export async function deleteImageFileAt(directory: string, filename: string) {
  const filePath = path.join(process.cwd(), 'public', directory, filename);

  try {
    await fs.access(filePath); // Check if file exists
    await fs.unlink(filePath); // Delete it
    return {
      success: true,
      message: `File '${filename}' deleted from /${directory}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `File '${filename}' not found in /${directory}`,
      error,
    };
  }
}