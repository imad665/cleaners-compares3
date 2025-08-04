import { prisma } from "../prisma";
import path from 'path';
import { promises as fs } from 'fs';
export async function readVideos() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data-old-website', 'videos.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return { data: JSON.parse(fileContents), start: 10 };
    } catch (error) {
        console.error('Error reading videos.json:', error);
        return null;
    }
}
const extractVideoId = (url: string) => {
    const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/|img\.youtube\.com\/vi\/)([^\/&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};
async function createVideoIfNotExist(
    title: string,
    url: string,
    description: string,
    thumbnail: string,
    category: string
) {
    const existing = await prisma.video.findFirst({ where: { url } });
    if (existing) return;
    const video = await prisma.video.create({
        data: {
            title,
            url,
            description,
            thumbnail,
            category
        },
    });
}

export default async function SeedDataVideo() {
    const {data,start} = await readVideos() || {data:[],start:0};
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const category = d.category
        const videosInfo = d.data;
        const promises = videosInfo.map((video) => {
            const title = video.title;
            const videoId = extractVideoId(video.img);
            const desc = video.desc;
            const url = `https://www.youtube.com/embed/${videoId}`;
            const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

            return createVideoIfNotExist(title, url, desc, thumbnail, category);
        });

        await Promise.allSettled(promises); // waits for all promises to settle
        
    }
}