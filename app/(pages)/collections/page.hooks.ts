import { useSnackbar } from 'notistack';

import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import createCollction, {
    Request as CollectionRequest,
} from '@/services/api/collections/createCollection';
import getCollection from '@/services/api/collections/getCollection';
import updateCollection from '@/services/api/collections/updateCollection';

export const useCollection = ({
    reference,
    secret,
    enabled = true,
}: {
    reference: string;
    secret?: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['collection', { reference: reference, secret }],
        queryFn: () => getCollection({ reference: reference, secret }),
        enabled: enabled,
    });
};

export const useCreateCollection = ({
    secret,
    ...params
}: {
    secret?: string;
} & CollectionRequest) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => createCollction({ ...params, secret: secret }),
        mutationKey: ['createCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
            });
            enqueueSnackbar('Колекцію успішно створено', {
                variant: 'success',
            });
            router.push(`/collections/${data.reference}`);
        },
    });
};

export const useUpdateCollection = ({
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
