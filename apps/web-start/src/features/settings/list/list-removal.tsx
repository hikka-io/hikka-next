import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    ContentTypeEnum,
    deleteUserReadMutation,
    deleteUserWatchMutation,
} from '@hikka/api';

import ListRemovalItem from './components/list-removal-item';

const ListRemoval = () => {
    const queryClient = useQueryClient();

    const { mutate: deleteWatchList } = useMutation({
        ...deleteUserWatchMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    (query.queryKey[0] as { _id?: string } | undefined)?._id ===
                    'userWatchList',
            });
            toast.success('Список аніме успішно видалено.');
        },
    });
    const { mutate: deleteReadList } = useMutation({
        ...deleteUserReadMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    (query.queryKey[0] as { _id?: string } | undefined)?._id ===
                    'userReadList',
            });
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
