'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useDeleteReadList, useDeleteWatchList } from '@hikka/react';
import { toast } from 'sonner';

import ListRemovalItem from '../components/list/list-removal-item';

const ListRemoval = () => {
    const { mutate: deleteWatchList } = useDeleteWatchList({
        options: {
            onSuccess: () => {
                toast.success('Список аніме успішно видалено.');
            },
        },
    });
    const { mutate: deleteReadList } = useDeleteReadList({
        options: {
            onSuccess: () => {
                toast.success('Список успішно видалено.');
            },
        },
    });

    const handleDeleteList = (content_type: ContentTypeEnum) => {
        switch (content_type) {
            case ContentTypeEnum.ANIME:
                deleteWatchList({});
                return;
            case ContentTypeEnum.MANGA:
            case ContentTypeEnum.NOVEL:
                deleteReadList({ contentType: content_type });
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
