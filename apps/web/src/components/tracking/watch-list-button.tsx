import type { FC } from 'react';

import {
    type AnimeInfoResponse,
    type AnimeResponse,
    ContentTypeEnum,
    type WatchResponseBase,
} from '@hikka/api';

import type { ButtonProps } from '@/components/ui/button';

import ListStatusButton from './list-status-button';

type Props = {
    slug: string;
    disabled?: boolean;
    watch?: WatchResponseBase | null;
    anime: AnimeResponse | AnimeInfoResponse | undefined;
    size?: 'sm' | 'md' | 'icon-sm' | 'icon-md';
    buttonProps?: ButtonProps;
};

const WatchListButton: FC<Props> = ({ watch, anime, ...props }) => (
    <ListStatusButton
        {...props}
        contentType={ContentTypeEnum.ANIME}
        entry={watch}
        content={anime}
    />
);

export default WatchListButton;
