// lib/getLogoVersion.ts (server-only)
'server only'

import fs from 'fs';
import path from 'path';

export async function getLogoVersion(): Promise<number> {
    const logoPath = path.join(process.cwd(), 'public', 'uploads', 'logo.png');
    const stat = await fs.promises.stat(logoPath);
    return stat.mtime.getTime();
}

