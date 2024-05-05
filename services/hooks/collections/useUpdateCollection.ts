import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Params as CollectionRequest } from '@/services/api/collections/createCollection';
import updateCollection from '@/services/api/collections/updateCollection';

const useUpdateCollection = (params: {
    reference: string;
} & CollectionRequest) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () =>
            updateCollection({
                params,
            }),
        mutationKey: ['updateCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
                exact: false,
            });
            enqueueSnackbar('Колекцію успішно оновлено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export default useUpdateCollection;
