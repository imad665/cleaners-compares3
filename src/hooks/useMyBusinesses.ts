import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher_swr';

export interface BusinessType {
    id: string;
    description: string;
    email: string;
    phone: string;
    imageUrl: string;
    location: string;
    title: string;
    turnoverRange: string;
    fullName: string;
    businessType: string;
    reasonForSelling: string;
    datePosted: string;
}

export function useMyBusinesses() {
    const { data, error, isLoading, mutate } = useSWR<{ myBusinesses: BusinessType[] }>('/api/admin/myBusinesses', fetcher);

    return {
        myBusinesses: data?.myBusinesses || [],
        isLoading,
        isError: error,
        mutate
    };
}
