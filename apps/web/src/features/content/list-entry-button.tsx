import type { FC } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { ReadListButton, WatchListButton } from '@/components/tracking';
import type { ContentInfo } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

type Props = {
    content_type: MainContentTypeEnum | 'character' | 'person';
    content?: ContentInfo<Props['content_type']>;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
};

const ListEntryButton: FC<Props> = ({
    content_type,
    content,
    disabled,
    size,
}) => {
    const params = useParams();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchListButton
                    slug={String(params.slug)}
                    size={size}
                    anime={content?.data_type === 'anime' ? content : undefined}
                    disabled={disabled}
                />
            );
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return (
                <ReadListButton
                    slug={String(params.slug)}
                    size={size}
                    content_type={content_type}
                    content={
                        content?.data_type === 'manga' ||
                        content?.data_type === 'novel'
                            ? content
                            : undefined
                    }
                    disabled={disabled}
                />
            );
        case ContentTypeEnum.PERSON:
        case ContentTypeEnum.CHARACTER:
            return null;
        default:
            return null;
    }
};

export default ListEntryButton;
