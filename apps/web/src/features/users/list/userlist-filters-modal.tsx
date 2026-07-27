import type { FC } from 'react';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadContentTypeEnum,
} from '@hikka/api';

import { AnimeFiltersModal, ReadFiltersModal } from '@/features/filters';

type Props = {
    content_type: MainContentTypeEnum;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const UserlistFiltersModal: FC<Props> = ({
    content_type,
    open,
    onOpenChange,
}) =>
    content_type === ContentTypeEnum.ANIME ? (
        <AnimeFiltersModal
            open={open}
            onOpenChange={onOpenChange}
            sort_type="watch"
        />
    ) : (
        <ReadFiltersModal
            open={open}
            onOpenChange={onOpenChange}
            content_type={content_type as ReadContentTypeEnum}
            sort_type="read"
        />
    );

export default UserlistFiltersModal;
