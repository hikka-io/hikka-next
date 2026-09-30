import type { FC } from 'react';

import type {
    MangaInfoResponse,
    MangaResponse,
    NovelInfoResponse,
    NovelResponse,
    ReadContentTypeEnum,
    ReadResponseBase,
} from '@hikka/api';

import type { ButtonProps } from '@/components/ui/button';

import ListStatusButton from './list-status-button';

type Props = {
    slug: string;
    disabled?: boolean;
    content_type: ReadContentTypeEnum;
    read?: ReadResponseBase | null;
    content:
        | MangaResponse
        | NovelResponse
        | MangaInfoResponse
        | NovelInfoResponse
        | undefined;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
};

const ReadListButton: FC<Props> = ({ content_type, read, ...props }) => (
    <ListStatusButton {...props} contentType={content_type} entry={read} />
);

export default ReadListButton;
