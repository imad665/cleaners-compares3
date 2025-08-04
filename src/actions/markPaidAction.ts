'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function markPaymentAsPaid(orderPaymentId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized: Please login as admin');
    }
    console.log(orderPaymentId,'====================');

  try {
    const updatedPayment = await prisma.orderPayment.update({
      where: { id: orderPaymentId },
      data: { isAdminPaidToSeller: true },
    });

    return { success: true, payment: updatedPayment };
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    return {success:false,message:'Failed to mark payment as paid'}
    
  }
}