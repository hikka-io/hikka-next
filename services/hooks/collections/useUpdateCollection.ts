import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Request as CollectionRequest } from '@/services/api/collections/createCollection';
import updateCollection from '@/services/api/collections/updateCollection';


const useUpdateCollection = ({
    secret,
    reference,
    ...params
}: {
    reference: string;
    secret?: string;
} & CollectionRequest) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () =>
            updateCollection({
                ...params,
                secret: secret,
                reference: reference,
            }),
        mutationKey: ['updateCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
            });
            enqueueSnackbar('Колекцію успішно оновлено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export default useUpdateCollection;
