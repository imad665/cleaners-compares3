'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // adjust path to where your auth config is
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs';

export async function formSellerAction(prev: any, formData: FormData) {
  let userId = formData.get('userId') as string | undefined;
  let session = {
    user:{
      email:formData.get('email') as string
    }
  }
  if (!userId) {
    const session = await getServerSession(authOptions)

    // 1. Check session
    if (!session || !session.user) {
      return { success: false, redirect: '/login' }
    }

    userId = session.user.id
  }


  // 2. Extract fields
  const businessName = formData.get('businessName')?.toString().trim()
  const city = formData.get('city')?.toString().trim()
  const country = formData.get('country')?.toString().trim()
  const phoneNumber = formData.get('phoneNumber')?.toString().trim()

  // 3. Validate fields
  if (!businessName || !city || !country || !phoneNumber) {
    return { success: false, error: 'All fields are required.' }
  }
  //console.log(userId,';;;--------;;;;;;;;');

  // 4. Check if seller profile already exists
  const existing = await prisma.sellerProfile.findUnique({
    where: { userId }
  })

  if (existing) {
    await prisma.sellerProfile.deleteMany();
    return { success: false, error: 'You have already submitted a seller profile.' }
  }
  let role: 'SELLER' | 'ADMIN' | 'BUYER' = 'SELLER'
  if (session.user.email === 'admin@cleancompare.com')
    role = 'ADMIN'
  // 5. Create seller profile
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })

  try {
    await prisma.sellerProfile.create({
      data: {
        userId,
        businessName,
        city,
        country,
        phoneNumber,
        verified: false
      }
    })

    return { success: true, message: 'Seller profile submitted successfully.' }
  } catch (error) {
    console.error('Error creating seller profile:', error)
    return { success: false, error: 'Something went wrong. Please try again later.' }
  }
}

export async function updateFormSellerAction(id: string, sellerForm: {
  businessName: string,
  phoneNumber: string,
  address: string,
  postCode: string,
  newPassword:string
}) {
  //await new Promise((res) => setTimeout(res, 3000));
  //console.log(sellerForm,'----------');
  

  if(sellerForm.newPassword){
    //console.log(sellerForm.newPassword,'-----============----');
    const session = await getServerSession(authOptions); 
    const user = session?.user;
    await prisma.user.update({
      where:{id:user!.id},
      data:{
        password:bcrypt.hashSync(sellerForm.newPassword)
      }
    })
  }
  try {
    await prisma.sellerProfile.update({
      where: { id },
      data: {
        businessName: sellerForm.businessName,
        phoneNumber: sellerForm.phoneNumber,
        city: sellerForm.address,
        country: sellerForm.postCode
      },
    })
    return { success: true, message: "success" }
  } catch (error) {
    return { success: false, error: error.toString() }
  }


}
