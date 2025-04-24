import {
    ContentTypeEnum,
    MangaInfoResponse,
    MangaResponse,
} from '@hikka/client';
import { FC } from 'react';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/common';

import ContentCard, {
    Props as ContentCardProps,
} from './content-card/content-card';

interface Props extends ContentCardProps {
    manga: MangaResponse | MangaInfoResponse;
}

const MangaCard: FC<Props> = ({ manga, ...props }) => {
    return (
        <ContentCard
            read={manga.read ? manga.read[0] : undefined}
            slug={manga.slug}
            content_type={ContentTypeEnum.MANGA}
            withContextMenu
            href={`/manga/${manga.slug}`}
            image={manga.image}
            title={manga.title}
            leftSubtitle={manga.year ? String(manga.year) : undefined}
            rightSubtitle={
                manga.media_type
                    ? MANGA_MEDIA_TYPE[manga.media_type].title_ua
                    : undefined
            }
            {...props}
        />
    );
};

export default MangaCard;
