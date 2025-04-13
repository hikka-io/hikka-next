import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import updateCollection, {
    Params,
} from '../../api/collections/updateCollection';

const useUpdateCollection = (params: Params) => {
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
                queryKey: ['collection', data.reference],
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
