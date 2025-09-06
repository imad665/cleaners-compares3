// lib/chatMemory.ts
'use server';

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function createChatSession() {
  const session = await getServerSession(authOptions);
  if(!session) return
  const user = session?.user;
  return await prisma.chatSession.create({
    data: {userId:user.id}
  });
}

export async function addMessageToSession(sessionId: string, role: string, content: string) {
  return await prisma.chatMessage.create({
    data: {
      role,
      content,
      sessionId
    }
  });
}

export async function getChatHistory(sessionId: string, limit: number = 10) {
  return await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: limit
  });
}

export async function clearChatSession(sessionId: string) {
  return await prisma.chatMessage.deleteMany({
    where: { sessionId }
  });
}