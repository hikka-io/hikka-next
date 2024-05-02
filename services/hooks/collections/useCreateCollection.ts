import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import createCollction, {
    Params as CollectionRequest,
} from '@/services/api/collections/createCollection';

const useCreateCollection = (params: CollectionRequest) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => createCollction({ params }),
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
