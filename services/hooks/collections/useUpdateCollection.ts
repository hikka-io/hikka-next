import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Request as CollectionRequest } from '@/services/api/collections/createCollection';
import updateCollection from '@/services/api/collections/updateCollection';
import { useAuthContext } from '@/services/providers/auth-provider';


const useUpdateCollection = ({
    reference,
    ...params
}: {
    reference: string;
} & CollectionRequest) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () =>
            updateCollection({
                ...params,
                secret: secret!,
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
