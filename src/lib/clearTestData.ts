import bcrypt from "bcryptjs";
import { prisma } from "./prisma";



export async function updatePasswordUsers() {
    await prisma.user.updateMany({
        where:{
            createdAt:{
                lt:new Date("2025-07-16")
            }
        },
        data:{
            password:bcrypt.hashSync('123456789')
        }
    })
}





export async function clearOrders() {
  const date = new Date("2025-07-30");

  try {
    await prisma.$transaction(async (tx) => {
      // First, find all orders to delete
      const ordersToDelete = await tx.order.findMany({
        where: {
          createdAt: {
            lt: date,
          },
        },
        select: {
          id: true,
        },
      });

      const orderIds = ordersToDelete.map(order => order.id);

      // Delete related records in proper order
      await tx.message.deleteMany({
        where: {
          orderId: {
            in: orderIds,
          },
        },
      });

      await tx.orderPayment.deleteMany({
        where: {
          orderId: {
            in: orderIds,
          },
        },
      });

      await tx.notificationOrder.deleteMany({
        where: {
          orderId: {
            in: orderIds,
          },
        },
      });

      await tx.orderItem.deleteMany({
        where: {
          orderId: {
            in: orderIds,
          },
        },
      });

      // Finally, delete the orders
      await tx.order.deleteMany({
        where: {
          id: {
            in: orderIds,
          },
        },
      });
    });

    console.log("Orders and all related data cleared successfully.");
  } catch (error) {
    console.error("Error clearing orders:", error);
    throw error; // Re-throw the error so calling code knows it failed
  } finally {
    await prisma.$disconnect();
  }
}