import { prisma } from "./prisma";

export default async function deleteUserTested() {
  try {
    // Find users created after July 19, 2025
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gt: new Date('2025-07-19')
        }
      },
      select: {
        id: true
      }
    });

    const userIds = users.map(user => user.id);

    if (userIds.length === 0) {
      console.log('No users found created after July 19, 2025');
      return; 
    }
    //console.log(`Found ${userIds.length} users to delete`);
    //return

    console.log(`Found ${userIds.length} users to delete`);

    // First handle the many-to-many favorites relationship separately
    // Find all products that have these users as favorites
    const favoriteProducts = await prisma.product.findMany({
      where: {
        favoritedBy: {
          some: {
            id: { in: userIds }
          }
        }
      },
      select: {
        id: true
      }
    });

    // Disconnect all users from these products
    await prisma.$transaction(
      favoriteProducts.map(product =>
        prisma.product.update({
          where: { id: product.id },
          data: {
            favoritedBy: {
              disconnect: userIds.map(id => ({ id }))
            }
          }
        })
      )
    );

    // Now proceed with deleting all other related data
    await prisma.$transaction([
      // Delete messages
      prisma.message.deleteMany({
        where: {
          OR: [
            { senderUserId: { in: userIds } },
            { receiverUserId: { in: userIds } },
            { userId: { in: userIds } }
          ]
        }
      }),

      // Delete order payments
      prisma.orderPayment.deleteMany({
        where: {
          OR: [
            { sellerId: { in: userIds } },
            { order: { userId: { in: userIds } } }
          ]
        }
      }),

      // Delete order items
      prisma.orderItem.deleteMany({
        where: {
          OR: [
            { sellerId: { in: userIds } },
            { order: { userId: { in: userIds } }}
          ]
        }
      }),

      // Delete notifications
      prisma.notificationOrder.deleteMany({
        where: {
          order: { userId: { in: userIds } }
        }
      }),

      // Delete orders
      prisma.order.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete ratings
      prisma.rating.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { product: { sellerId: { in: userIds } } }
          ]
        }
      }),

      // Delete inquiries
      prisma.inquiry.deleteMany({
        where: {
          OR: [
            { buyerId: { in: userIds } },
            { sellerId: { in: userIds } }
          ]
        }
      }),

      // Delete wanted items
      prisma.wantedItem.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete business for sale
      prisma.businessForSale.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete contact info
      prisma.contactInfo.deleteMany({
        where: {
          OR: [
            { wantedItem: { userId: { in: userIds } } },
            { businessForSale: { userId: { in: userIds } } }
          ]
        }
      }),

      // Delete services
      prisma.service.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete products
      prisma.product.deleteMany({
        where: {
          sellerId: { in: userIds }
        }
      }),

      // Delete seller bank info
      prisma.sellerBankInfo.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete seller profiles
      prisma.sellerProfile.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete accounts
      prisma.account.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Delete sessions
      prisma.session.deleteMany({
        where: {
          userId: { in: userIds }
        }
      }),

      // Finally delete users
      prisma.user.deleteMany({
        where: {
          id: { in: userIds }
        }
      })
    ]);

    console.log(`Successfully deleted ${userIds.length} users and all related data`);
  } catch (error) {
    console.error('Error deleting users:', error);
    throw error;
  }
}