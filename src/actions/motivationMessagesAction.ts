// utils/motivationMessages.ts
'use server'
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";
//revalidateTag("products");
export const getCachedProducts = unstable_cache(
    async () => {
        const count = await prisma.product.count();
        const randomSkip = Math.max(0, Math.floor(Math.random() * (count - 20)));
        return prisma.product.findMany({
            select: { title: true },
            skip: randomSkip,
            take: 20,
        });
    },
    ["products"],
    {
        revalidate: 60 * 60 * 24 * 3, // 3 days
    }
);
// Random first names pool
const FIRST_NAMES = [
    "James", "Emma", "Oliver", "Sophia", "Harry", "Amelia", "George", "Isla",
    "Noah", "Ava", "Leo", "Mia", "Muhammad", "Lily", "Jack", "Freya",
    "Charlie", "Ella", "Thomas", "Grace", "Archie", "Scarlett", "Henry", "Evie",
    "Oscar", "Isabella", "Freddie", "Rosie", "Alfie", "Charlotte", "Theo", "Alice"
];

// Action phrases (present tense / recent)
const ACTIONS = [
    "just bought", "purchased", "ordered", "added to cart", "secured",
    "grabbed", "checked out", "completed purchase for", "snapped up"
];

// Time phrases
const TIME_PHRASES = [
    "right now!", "seconds ago", "1 minute ago", "2 minutes ago",
    "moments ago", "just now", "less than a minute ago"
];

// UK cities / regions for location
const LOCATIONS = [
    "Manchester", "London", "Birmingham", "Liverpool", "Leeds", "Sheffield",
    "Bristol", "Newcastle", "Nottingham", "Leicester", "Southampton", "Glasgow",
    "Edinburgh", "Cardiff", "Belfast", "Oxford", "Cambridge", "Brighton"
];

// Helper: get random element from array
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper: format product name – remove extra spaces, optionally shorten if too long
const formatProductName = (name: string): string => {
    // Trim and remove multiple spaces
    let cleaned = name.trim().replace(/\s+/g, ' ');
    // Optionally truncate very long names (keep it readable)
    if (cleaned.length > 40) cleaned = cleaned.slice(0, 37) + '...';
    return cleaned;
};

/**
 * Generate an array of random motivational messages using your actual product names.
 * @param count - Number of messages to generate (default: 20)
 * @returns Array of { id, text } messages
 */
export async function generateMotivationMessagesAction(count: number = 20): Promise<{ id: number; text: string }[]> {
    const productsData = (await getCachedProducts()).map(c => c.title);
    //console.log(productsData.length);

    const productList = productsData;  // your huge product array (import or define above)
    if (!productList.length) return [];

    // Shallow copy to avoid mutating original
    const availableProducts = [...productList];
    const messages: { id: number; text: string }[] = [];

    for (let i = 0; i < count; i++) {
        // Pick a random product (remove from available if you want no repeats this batch)
        let product: string;
        if (availableProducts.length === 0) {
            // If we've exhausted all products in this batch, refill (but keep original list)
            product = randomElement(productList);
        } else {
            const idx = Math.floor(Math.random() * availableProducts.length);
            product = availableProducts.splice(idx, 1)[0];
        }

        const formattedProduct = formatProductName(product);
        const name = randomElement(FIRST_NAMES);
        const action = randomElement(ACTIONS);
        const time = randomElement(TIME_PHRASES);
        const location = Math.random() > 0.6 ? ` from ${randomElement(LOCATIONS)}` : ''; // 40% chance to include location

        let text = '';
        // Vary message style for more natural feel
        const style = Math.floor(Math.random() * 4);
        switch (style) {
            case 0:
                text = `🔥 ${name} ${action} ${formattedProduct} ${location} – ${time}`;
                break;
            case 1:
                text = `⭐ ${name} ${action} ${formattedProduct} ${time}${location ? ` in ${location}` : ''}`;
                break;
            case 2:
                text = `🚀 ${formattedProduct} was just ${action.replace(/ed$/, 'ed')} by ${name} ${location} – ${time}`;
                break;
            default:
                text = `✨ ${name} ${action} ${formattedProduct} ${time}${location ? ` (${location})` : ''}`;
        }

        // Clean up extra spaces
        text = text.replace(/\s+/g, ' ').trim();

        messages.push({ id: i + 1, text });
    }

    return messages;
}

// Example usage (if you run this file standalone):
// const freshMessages = generateMotivationMessages(15);
// console.log(freshMessages);