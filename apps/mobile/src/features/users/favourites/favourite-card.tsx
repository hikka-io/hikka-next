import type { FC } from 'react';

import type { Href } from 'expo-router';

import { ContentTypeEnum, type FavouriteContentTypeEnum } from '@hikka/api';
import { getMediaTypeLabel } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { useTitle } from '@/services/session';
import { contentHref } from '@/utils/content-href';

export type FavouriteItem = Record<string, unknown> & {
    slug?: string;
    reference?: string;
    image?: string | null;
    media_type?: string | null;
    year?: number | null;
    title?: string;
    nsfw?: boolean;
    spoiler?: boolean;
    collection?: { content?: { image?: string | null } }[];
};

export const favouriteKey = (item: FavouriteItem) =>
    item.slug ?? item.reference ?? '';

type Props = {
    type: FavouriteContentTypeEnum;
    item: FavouriteItem;
};

/** The web's per-category favourite card: media, entity or collection poster. */
const FavouriteCard: FC<Props> = ({ type, item }) => {
    const getTitle = useTitle();
    if (type === ContentTypeEnum.COLLECTION) {
        return (
            <PosterCard
                href={`/collections/${item.reference}` as Href}
                title={item.title}
                image={item.collection?.[0]?.content?.image ?? undefined}
                titleBlur={item.spoiler}
                imageBlur={item.nsfw || item.spoiler}
                leftSubtitle={item.nsfw ? '+18' : null}
                rightSubtitle={item.spoiler ? 'Спойлери' : null}
            />
        );
    }

    const media =
        type === ContentTypeEnum.ANIME ||
        type === ContentTypeEnum.MANGA ||
        type === ContentTypeEnum.NOVEL;

    return (
        <PosterCard
            href={contentHref(type, item.slug ?? '')}
            title={getTitle(item)}
            image={item.image ?? undefined}
            leftSubtitle={media && item.year ? String(item.year) : null}
            rightSubtitle={media ? getMediaTypeLabel(item.media_type) : null}
        />
    );
};

export default FavouriteCard;
