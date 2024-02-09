import { useQuery } from '@tanstack/react-query';
import getEditList from '@/services/api/edit/getEditList';
import getEdit from '@/services/api/edit/getEdit';

export const useEditList = (page: string) => {
    return useQuery({
        queryKey: ['editList', page],
        queryFn: () =>
            getEditList({
                page: Number(page),
            }),
    })
}

export const useEdit = <T extends Hikka.Edit>(editId: string) => {
    return useQuery<T, Error>({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
    })
}