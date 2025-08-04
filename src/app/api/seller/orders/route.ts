// app/api/seller/orders/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { dataFeatureProduct, dataFeatureService } from '@/lib/payement/data';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const isMain = searchParams.get('isMain') === 'true';
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.orderItem.updateMany({
    where: {
      sellerId: session.user.id,
      isReadSeller: false  // Only update unread items
    },
    data: {
      isReadSeller: true  // Mark them as read
    }
  });

  const isAdmin = session.user.role === 'ADMIN';
  let totalServiceFeaturedRevenu = 0;
  let totalProductFeaturedRevenu = 0;
  let totalRevenueFromSellerPurchase = 0;
  if (isMain && isAdmin) {
    const featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true
      },
      select: {
        featureDays: true,
      }
    });
    //console.log(featuredProducts, ';;;;;;;;;;;;;;;;;;;;;;');

    const featuredBusinessForSales = await prisma.service.findMany({
      where: {
        isFeatured: true,
      },
      select: {
        featureDays: true,
        createdAt: true,
      }
    })
    //console.log(featuredBusinessForSales, ';;;;;;;;;;;;;;;;;;;;;;');
    totalServiceFeaturedRevenu = featuredBusinessForSales.reduce((sum, s) => {
      const featured = dataFeatureService.find((d) => d.key === s.featureDays?.replace('$', '£'));
      console.log(featured, s.featureDays);

      const amount = featured?.amount;
      return sum + amount / 100
    }, 0)
    totalProductFeaturedRevenu = featuredProducts.reduce((sum, s) => {
      const featured = dataFeatureProduct.find((d) => d.key === s.featureDays);
      const amount = featured?.amount;
      return sum + amount / 100
    }, 0)
    //console.log(totalProductRevenu,totalServiceRevenu, 'oooooooooooooooo---------++++++++');
    //https://cleaner-compare.vercel.app/api/create-checkout-session/webhook
    const ordersData = await prisma.orderItem.findMany({
      where: {
        status: "DELIVERED"
      },
      select: {
        unitPrice: true,
        order: {
          select: {
            commisionRate: true,
          }
        }
      }
    })

    totalRevenueFromSellerPurchase = ordersData
      .reduce((sum, order) => {
        const totalPrice = order.unitPrice;
        const commission = totalPrice * ((order.order.commisionRate || 0) / 100);
        return sum + commission;
      }, 0);
  }


  try {


    const orders = await prisma.orderItem.findMany({
      where: {
        sellerId: session.user.id
      },
      include: {
        product: {
          select: {
            title: true,
            imagesUrl: true
          }
        },
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              },
            },
          },
        }
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      }
    });
    if(isMain){
      return NextResponse.json({
        ordersData:orders,
        totalProductFeaturedRevenu,
        totalServiceFeaturedRevenu,
        totalRevenueFromSellerPurchase})
    }
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}