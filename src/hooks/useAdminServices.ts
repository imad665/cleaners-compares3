import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher_swr';

export interface Service {
  id: string;
  title: string;
  category: {
    name: string;
  };
  ratePerHour: number;
  callOutCharges: number;
  areaOfService: string;
  email: string;
  isFeatured: boolean;
  isEnabled: boolean;
  pictureUrl?: string;
  contactNumber: string;
  address: string;
  companyType: string;
  experience: string;
  featuredEndDate?: string;
}

export function useAdminServices() {
  const { data, error, isLoading, mutate } = useSWR<{ services: Service[] }>('/api/admin/myServices', fetcher);

  return {
    services: data?.services || [],
    isLoading,
    isError: error,
    mutate
  };
}
