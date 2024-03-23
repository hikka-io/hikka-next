import { useQuery } from '@tanstack/react-query';



import getCollection from '@/services/api/collections/getCollection';


import useAuth from '../auth/useAuth';


const useCollection = ({
    reference,
    enabled = true,
}: {
    reference: string;
    enabled?: boolean;
}) => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['collection', reference, { auth }],
        queryFn: () => getCollection({ reference: reference, auth }),
        enabled: enabled,
        staleTime: 0,
    });
};

export default useCollection;
