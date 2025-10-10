'use server'
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resetPasswordEmail(email: string) {
    // Check if user exists

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { message: "If this email exists, we've sent a reset link" };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });
        // Send email with reset link
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

        const { data, error } = await resend.emails.send({
            from: 'CleanersCompare <noreply@cleanerscompare.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset. Click the link below to set a new password:</p>
                <p><a href="${resetUrl}">Reset Password</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        });
        if (error) {
            return { error: 'somthing went wrong!' }
        }

        return { message: "Password reset link sent to your email" };
    } catch (error) {
        return { error: 'somthing went wrong!' }
    }



}

export async function updatePassword(token: string, password: string) {
    // Find user with this reset token

    try {
        if (!token) {
            return { error: 'Token is required' }

        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date() // Check if token hasn't expired
                }
            }
        })

        if (!user) {
            return { error: 'Invalid or expired token' };

        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })
        return { message: 'Password updated successfully' }
    }catch(error){
        return { error: 'Failed to reset password' };
    }
    
}