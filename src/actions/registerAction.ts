'use server'

import { decryptPassword, encryptPassword } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function registerAction(prev: any, formData: FormData) {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();



    await new Promise((res) => setTimeout(res, 3000))
    if (!name || !email || !password || !confirmPassword) {
        return { success: false, error: 'All fields are required.' }
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match.' }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            return { success: false, error: 'Email is already registered.' }
        }
        const hashedPassword = encryptPassword(password)//await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "BUYER"
            }
        })
        return { success: true, email, password, userId: user.id }
    } catch (err) {
        console.error('Register error:', err);
        return { error: 'Something went wrong. Please try again.' }
    }
}