import path from 'path';
import { exists, promises as fs, stat } from 'fs';
import { prisma } from '../prisma';
import { AnyARecord } from 'dns';
import { getCachedImageUrl, saveImageCache, setCachedImageUrl } from './imageUrlCach';
import { extractPrice, fetchImageAsFile } from './seed';
import { uploadFileToCloud } from '../cloudStorage';
import { generateUniqueSlug } from '../products/slugGen';
import { subtle } from 'crypto';
export async function readAllData() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data-old-website', 'categories_with_machines.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading sundries.json:', error);
        return null;
    }
}


export async function seedCategories() {
    const data: any[] = await readAllData();
    //console.log(data);

    const categories = data['categories']
    //await prisma.category.deleteMany()
    for (const category of categories) {
        const slug = await generateUniqueSlug(category['title'])
        const existCategory = await prisma.category.findFirst({
            where: {
                slug
            }
        })
        if (!existCategory) {
            await prisma.category.create({
                data: {
                    name: category['title'],
                    description: category['description'],
                    status: 'ACTIVE',
                    slug,
                }
            })
        } else {
            console.log('exist.............');

        }

    }
}

async function getCategoryId(categoryName: string) {
    const c = await prisma.category.findFirst({
        where: {
            name: categoryName,
        },
        select: { id: true }
    })
    return c!.id
}

export async function seedSubcategories() {
    const data: any[] = await readAllData();
    //console.log(data);

    const categories = data['categories']

    for (const category of categories) {
        const parentCategoryId = await getCategoryId(category['title'])
        const subcategories = category['subcategories']
        for (const sub of subcategories) {
            const name = sub['title']
            if (name !== "Engineers") {
                const description = sub['description'] || ''
                const slug = await generateUniqueSlug(name);
                const existSubCategory = await prisma.category.findFirst({
                    where: {
                        slug,
                        parentId: parentCategoryId
                    }
                })
                if (!existSubCategory) {
                    await prisma.category.create({
                        data: {
                            name,
                            status: 'ACTIVE',
                            parentId: parentCategoryId!,
                            description,
                            slug
                        }
                    })
                } /* else {
                    console.log('exist subcategorie.............');
                } */
            }

        }
    }
}



async function getSubcategoryId(parentTitle: string, subTitle: string) {
    const subca = await prisma.category.findFirst({
        where: {
            name: {
                equals: subTitle
            },
            parent: {
                name: {
                    equals: parentTitle
                }
            }
        },
        select: { id: true }
    })
    return subca!.id;
}


async function getImageUrlsUploaded(imageUrls: string[]) {
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
    return uploadedImageUrls
}


async function isProductIsExist(productName: string, sellerId: string) {
    const isExist = await prisma.product.findFirst({
        where: {
            title: productName,
            sellerId: sellerId.toString()
        }
    })


    return isExist

}

async function getUserId(userIdOld: string) {
    const user = await prisma.user.findFirst({
        where: {
            userIdOld: {
                contains: userIdOld.toString(),
            },
        },
        select: {
            id: true,
        },
    });

    //console.log(user, userIdOld, 'eeeeeeeeeeeeeeeeee');

    return user?.id ?? null; // safer if no user found
}


export async function seedMachines() {

    const data: any[] = await readAllData();
    const categories = data['categories']

    for (const category of categories) {
        if (category['title'] === 'Machines') {
            const subcategories = category['subcategories']
            for (const sub of subcategories) {

                const machines = sub['machines'];
                for (const product of machines) {
                    const sellerId = await getUserId(product['webMemberId'])
                    //console.log(isProductIsExist(product['title'], sellerId));

                    if (!await isProductIsExist(product['title'], sellerId)) {
                        const subcategoryId = await getSubcategoryId(category['title'], sub['title'])
                        let price_exc_vat = product['price']
                        console.log(price_exc_vat, 'ssssssss');


                        const baseUrl = "https://www.cleanerscompare.com/pics/1/"
                        let images = product['images'];
                        if (images.length === 0) {
                            images = ['imageunavailable.jpg']
                        }
                        images = images.map((img: string) => `${baseUrl}/${img}`)
                        const uploadedImageUrls = await getImageUrlsUploaded(images)
                        function getCondition(c: string) {
                            if (!c || c?.toLocaleLowerCase() === 'new') return 'NEW'
                            return 'USED'
                        }
                        await prisma.product.create({
                            data: {
                                title: product['title'],
                                description: product['description'] || product['title'],
                                price: price_exc_vat,
                                units: 1,
                                condition: getCondition(product['condition']?.trim().toUpperCase()),
                                imagesUrl: uploadedImageUrls,
                                categoryId: subcategoryId,
                                slug: await generateUniqueSlug(product['title']),
                                sellerId,
                                isFeatured: false,
                                stock: 1,
                                createdAt: new Date(product['dateAdded'])

                            }
                        })
                    } else {
                        console.log('exist machine product.............');
                    }

                }
            }
        }

    }
    await saveImageCache();
}


export async function seedSundries() {
    const data: any[] = await readAllData();
    const categories = data['categories']

    for (const category of categories) {
        if (category['title'] === 'Sundries') {
            const subcategories = category['subcategories']
            for (const sub of subcategories) {

                const items = sub['items'];
                for (const product of items) {
                    const sellerId = await getUserId(product['webMemberId'])
                    //console.log(isProductIsExist(product['title'], sellerId));

                    if (!await isProductIsExist(product['title'], sellerId)) {
                        const subcategoryId = await getSubcategoryId(category['title'], sub['title'])
                        let price_exc_vat = product['price']
                        console.log(price_exc_vat, 'ssssssss');


                        const baseUrl = "https://www.cleanerscompare.com/pics/1/"
                        let images = product['images'];
                        if (images.length === 0) {
                            images = ['imageunavailable.jpg']
                        }
                        images = images.map((img: string) => `${baseUrl}/${img}`)
                        const uploadedImageUrls = await getImageUrlsUploaded(images)
                        function getCondition(c: string) {
                            if (!c || c?.toLocaleLowerCase() === 'new') return 'NEW'
                            return 'USED'
                        }
                        await prisma.product.create({
                            data: {
                                title: product['title'],
                                description: product['description'] || product['title'],
                                price: price_exc_vat,
                                units: product['units'],
                                condition: getCondition(product['condition']?.trim().toUpperCase()),
                                imagesUrl: uploadedImageUrls,
                                categoryId: subcategoryId,
                                slug: await generateUniqueSlug(product['title']),
                                sellerId,
                                isFeatured: false,
                                stock: 1,
                                createdAt: new Date(product['dateAdded'])
                            }
                        })
                    } else {
                        console.log('exist machine product.............');
                    }

                }
            }
        }

    }
    await saveImageCache();
}




export async function seedParts() {

    const data: any[] = await readAllData();
    const categories = data['categories']

    for (const category of categories) {
        if (category['title'] === 'Parts') {
            const subcategories = category['subcategories']
            for (const sub of subcategories) {

                const items = sub['items'];
                for (const product of items) {
                    const sellerId = await getUserId(product['webMemberId'])
                    //console.log(isProductIsExist(product['title'], sellerId));

                    if (!await isProductIsExist(product['title'], sellerId)) {
                        const subcategoryId = await getSubcategoryId(category['title'], sub['title'])
                        let price_exc_vat = product['price']
                        //console.log(price_exc_vat, 'ssssssss');


                        const baseUrl = "https://www.cleanerscompare.com/pics/1/"
                        let images = product['images'];
                        if (images.length === 0) {
                            images = ['imageunavailable.jpg']
                        }
                        images = images.map((img: string) => `${baseUrl}/${img}`)
                        const uploadedImageUrls = await getImageUrlsUploaded(images)
                        function getCondition(c: string) {

                            if (!c || c?.toLocaleLowerCase() === 'new') return 'NEW'
                            return 'USED'
                        }
                        await prisma.product.create({
                            data: {
                                title: product['title'],
                                description: product['description'] || product['title'],
                                price: price_exc_vat,
                                units: product['units'],
                                condition: getCondition(product['condition']?.trim().toUpperCase()),
                                imagesUrl: uploadedImageUrls,
                                categoryId: subcategoryId,
                                slug: await generateUniqueSlug(product['title']),
                                sellerId,
                                isFeatured: false,
                                stock: 1,
                                createdAt: new Date(product['dateAdded'])

                            }
                        })
                    } else {
                        console.log('exist parts product.............');
                    }

                }
            }
        }

    }
    await saveImageCache();
}


export async function updateUserRoles() {
    await prisma.user.updateMany({
        where: {
            products: {
                some: {} // means: user has at least one product
            }
        },
        data: {
            role: 'SELLER'
        }
    });
}
