import { useQuery } from '@tanstack/react-query';



import getCollections from '@/services/api/collections/getCollections';


import useAuth from '../auth/useAuth';


const useCollections = ({
    page,
    size,
    enabled = true,
}: {
    page?: number;
    size?: number;
    enabled?: boolean;
}) => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['collections', { page, size, auth }],
        queryFn: () => getCollections({ page, size, auth }),
        enabled: enabled,
    });
};

export default useCollections;
