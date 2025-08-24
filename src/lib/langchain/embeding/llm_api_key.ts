import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";

export default async function getLLmApiKey(isDecrypt:boolean=true) {
    const settings = await prisma.adminSetting.findMany({ where: { key: { in: ['openai', 'gemini'] } } })
    //console.log(settings,'ooooooooooooooooooooooooooooo');
    const apikey = settings.find((s) => s.key === 'openai')?.value || ''
    const geminiApiKey = settings.find((s) => s.key === 'gemini')?.value || '';
    if(isDecrypt)
        return {apikey:decrypt(apikey),geminiApiKey:decrypt(geminiApiKey)}
    return {apikey,geminiApiKey}
}