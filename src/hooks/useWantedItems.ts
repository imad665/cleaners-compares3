import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher_swr';

export interface WantedItem {
    id: string;
    title: string;
    location: string;
    description: string;
    datePosted: string;
    email: string;
    phone: string;
    imageUrl: string;
    fullName: string;
}

export function useWantedItems() {
    const { data, error, isLoading, mutate } = useSWR<{ wantedItems: WantedItem[] }>('/api/admin/myWantedItems', fetcher);

    return {
        wantedItems: data?.wantedItems || [],
        isLoading,
        isError: error,
        mutate
    };
}
