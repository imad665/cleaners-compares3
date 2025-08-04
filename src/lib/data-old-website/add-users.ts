import path from 'path';
import { promises as fs } from 'fs';
import { prisma } from '../prisma';
import { AnyARecord } from 'dns';
import { getCachedImageUrl, saveImageCache, setCachedImageUrl } from './imageUrlCach';
import { extractPrice, fetchImageAsFile } from './seed';
import { uploadFileToCloud } from '../cloudStorage';
import { generateUniqueSlug } from '../products/slugGen';

export async function readAllData() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data-old-website', 'all-data-2.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading sundries.json:', error);
        return null;
    }
}


async function createUsersIfNotExist(userInfo: any) {
    const existingUser = await prisma.user.findFirst({
        where: { email: userInfo['email'] },

    });

    if (existingUser) return;

    const data: any = {
        name: userInfo['name-business'],
        email: userInfo['email'],
        password: userInfo['password'], // Ideally, hash this with bcrypt!
        role: userInfo['role'],
    };

    if (userInfo['role'] === 'SELLER') {
        data.sellerProfile = {
            create: {
                businessName: userInfo['name-business'],
                city: userInfo['city'],
                country: userInfo['country'],
                phoneNumber: userInfo['telephone'],
                verified: false,
            },
        };
    }

    await prisma.user.create({ data });
}


export async function seedUsers() {
    const data: any[] = await readAllData();
    const usersInfo = data.map(b => b['userInfo']);

    // Use batch processing with Promise.all, but limit concurrency for large datasets
    for (const chunk of chunkArray(usersInfo, 20)) {
        await Promise.all(chunk.map(user => createUsersIfNotExist(user)));
    }

    console.log('Done importing users');
}
/*
"title": "GASKET 1/4\" FOR HEATER ELEMENT",
"shipping": "Shipping Fee: £0.00",
"img": "https://www.cleanerscompare.com/pics/1/imageunavailable.jpg",
"price": "£0.23",
"category": "parts",
"subcategory": "Dry Cleaning"
*/
async function createProductIfNotExist(
    subcategoryId: string,
    product: any,
    sellerId: string) {

    const existingProduct = await prisma.product.findFirst({
        where: { title: product['title'] }
    });

    if (existingProduct) {
        return existingProduct;
    }

    const imageUrls = [product['img']]
    const uploadedImageUrls = [];

    for (const url of imageUrls) {
        const cached = getCachedImageUrl(url);
        if (cached) {
            uploadedImageUrls.push(cached);
            continue;
        }

        try {
            const file = await fetchImageAsFile(url);
            if (typeof file === 'string') {
                uploadedImageUrls.push(file)

            } else {
                const uploaded = await uploadFileToCloud(file);
                uploadedImageUrls.push(uploaded.url);
                setCachedImageUrl(url, uploaded.url);
            }

        } catch (error) {
            console.error('Error uploading image:', url, error);
        }
    }
    console.log(product['price'], 'ooooooooooooooooooooooooo');
    //if(typeof product['price']!='string') product['price']=''
    if(!product['price']) product['price']='';
    const price_exc_vat = extractPrice(
         product['price'].trim());
 
    const newProduct = await prisma.product.create({
        data: {
            title: product['title'],
            description: product['description'] || product['title'],
            price: price_exc_vat,
            units: 1,
            condition: product['condition']?.trim().toUpperCase() || 'NEW',
            imagesUrl: uploadedImageUrls,
            categoryId: subcategoryId,
            slug: await generateUniqueSlug(product['title']),
            sellerId,
            isFeatured: false,
            stock: 1,
            
        }
    });


}

function getSubcategory(category: 'sundries' | 'machines' | 'parts') {
    if (category === 'sundries') {
        return 'Counter Supplies'
    } else if (category === 'machines') {
        return 'Dry Cleaning'
    } else {
        return 'Dry Cleaning'
    }
}

async function getPreviousSub(
    item: any, previousSub: any,
    type: 'sundries' | 'machines' | 'parts'
) {
    const sub_subName: string = item.subcategory;
    const category = sub_subName === 'unknown' ? type : item.category;
    const subcategory = sub_subName === "unknown" ? getSubcategory(type) : sub_subName.split('-')[0];

    if (previousSub === null || sub_subName != previousSub.sub_subName) {
        console.log(subcategory, 'iooiiiiiiiiiiiiiiiiiiiiiiiiiiii');

        const subCa = await prisma.category.findFirst({
            where: {
                name: {
                    equals: subcategory,
                    mode: 'insensitive'
                },
                parent: {
                    name: {
                        equals: category,
                        mode: 'insensitive'
                    }
                }
            },
            select: {
                name: true,
                id: true,
            }
        });

        previousSub = await prisma.category.update({
            where: {
                id: subCa!.id
            },
            data: {
                sub_subName: sub_subName.replace("-", '_$_')
            }
        })
    }
    return previousSub;
}



export async function seedSundriesProducts() {
    const data: any[] = await readAllData();
    let previousSub: any = null;
    let k = 0
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const userInfo = d['userInfo'];
        const userItems = d['userItems'];
        
        if (!Array.isArray(userItems)) {
            //console.log(userItems, ';;;;;;;;;;');
            const seller = await prisma.user.findFirst(
            {
                where: { email: userInfo['email'] },
                select: { id: true }
            }
        )
            const items = userItems['items'];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                previousSub = await getPreviousSub(
                    item, previousSub, 'sundries');

                await createProductIfNotExist(
                    previousSub.id,
                    item, seller!.id);
            }

        }
    }
    await saveImageCache();
}

export async function seedMachinesProducts() {
    const data: any[] = await readAllData();
    let previousSub: any = null;
    let k = 0
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const userInfo = d['userInfo'];
        const userItems = d['userItems'];
        
        if (!Array.isArray(userItems)) {
            //console.log(userItems, ';;;;;;;;;;');
            const seller = await prisma.user.findFirst(
            {
                where: { email: userInfo['email'] },
                select: { id: true }
            }
        )
            const items = userItems['machines'];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                previousSub = await getPreviousSub(
                    item, previousSub, 'machines');

                await createProductIfNotExist(
                    previousSub.id,
                    item, seller!.id);
            }

        }
    }
    await saveImageCache();
}

export async function seedPartsProducts() {
    const data: any[] = await readAllData();
    let previousSub: any = null;
    let k = 0
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const userInfo = d['userInfo'];
        const userItems = d['userItems'];
        
        if (!Array.isArray(userItems)) {
            //console.log(userItems, ';;;;;;;;;;');
            const seller = await prisma.user.findFirst(
            {
                where: { email: userInfo['email'] },
                select: { id: true }
            }
        )
            const items = userItems['parts'];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                previousSub = await getPreviousSub(
                    item, previousSub, 'parts');

                await createProductIfNotExist(
                    previousSub.id,
                    item, seller!.id);
            }

        }
    }
    await saveImageCache();
}

// Optional helper to chunk large arrays to prevent DB overload
function chunkArray(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}
