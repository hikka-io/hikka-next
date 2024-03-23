import { useSnackbar } from 'notistack';



import { useRouter } from 'next/navigation';



import { useMutation, useQueryClient } from '@tanstack/react-query';



import createCollction, { Request as CollectionRequest } from '@/services/api/collections/createCollection';




import useAuth from '../auth/useAuth';


const useCreateCollection = (params: CollectionRequest) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => createCollction({ ...params, auth: auth! }),
        mutationKey: ['createCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
                exact: false,
            });
            enqueueSnackbar('Колекцію успішно створено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export default useCreateCollection;
