import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    ContentTypeEnum,
    deleteUserReadMutation,
    deleteUserWatchMutation,
} from '@hikka/api';

import {
    invalidateReadState,
    invalidateWatchState,
} from '@/utils/api/invalidate-content-state';

import ListRemovalItem from './components/list-removal-item';

const ListRemoval = () => {
    const queryClient = useQueryClient();

    const { mutate: deleteWatchList } = useMutation({
        ...deleteUserWatchMutation(),
        onSuccess: () => {
            invalidateWatchState(queryClient);
            toast.success('Список аніме успішно видалено.');
        },
    });
    const { mutate: deleteReadList } = useMutation({
        ...deleteUserReadMutation(),
        onSuccess: () => {
            invalidateReadState(queryClient);
            toast.success('Список успішно видалено.');
        },
    });

    const handleDeleteList = (content_type: ContentTypeEnum) => {
        switch (content_type) {
            case ContentTypeEnum.ANIME:
                deleteWatchList({});
                return;
            case ContentTypeEnum.MANGA:
            case ContentTypeEnum.NOVEL:
                deleteReadList({ path: { content_type } });
                return;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <ListRemovalItem
                onConfirm={() => handleDeleteList(ContentTypeEnum.ANIME)}
                title="Список аніме"
            />
            <ListRemovalItem
                onConfirm={() => handleDeleteList(ContentTypeEnum.MANGA)}
                title="Список манґи"
            />
            <ListRemovalItem
                onConfirm={() => handleDeleteList(ContentTypeEnum.NOVEL)}
                title="Список ранобе"
            />
        </div>
    );
};

export default ListRemoval;
