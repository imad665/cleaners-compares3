import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher_swr';

export interface Product {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    price: string;
    status: string;
    featured: boolean;
    date: string;
    stock: number;
    dealEndDate: string;
    featuredEndDate: string;
    subCategoryId: string;
    isDealActive: boolean;
    discountPrice: number | false;
    stockCount: number;
    listingStatus: string;
    description?: string;
    discountPercentage?: number;
    imagesUrl?: string[];
    condition?: string;
    weight?: string;
    videoUrl?: string;
    isIncVAT?: boolean;
    delivery_charge?: number;
    featureDays?: number;
    dealEndDateFormate?: string;
    customerCollects?: boolean;
    freeLocalDelivery?: boolean;
    vatType?: string;
}

export function useAdminProducts() {
    const { data, error, isLoading, mutate } = useSWR<{ products: Product[], categories: any[] }>('/api/admin/myProducts', fetcher);

    return {
        products: data?.products || [],
        categories: data?.categories || [],
        isLoading,
        isError: error,
        mutate
    };
}
