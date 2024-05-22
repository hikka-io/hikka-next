import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import deleteCollection from '@/services/api/collections/deleteCollection';
import useSession from '@/services/hooks/auth/useSession';

const useDeleteCollection = ({ reference }: { reference: string }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user: loggedUser } = useSession();

    return useMutation({
        mutationFn: () =>
            deleteCollection({
                params: {
                    reference,
                },
            }),
        mutationKey: ['deleteCollection'],
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ['collection', { reference: data.reference }],
            });
            enqueueSnackbar('Колекцію успішно видалено', {
                variant: 'success',
            });
            router.push(`/u/${loggedUser?.username}`);
        },
    });
};

export default useDeleteCollection;
