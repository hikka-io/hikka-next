import { FC } from 'react';

import ContentCard, {
    Props as ContentCardProps,
} from '@/components/content-card/content-card';

import { MANGA_MEDIA_TYPE } from '@/utils/constants';

interface Props extends ContentCardProps {
    manga: API.Manga | API.MangaInfo;
}

const MangaCard: FC<Props> = ({ manga, ...props }) => {
    return (
        <ContentCard
            read={manga.read ? manga.read[0] : undefined}
            slug={manga.slug}
            content_type="manga"
            withContextMenu
            href={`/manga/${manga.slug}`}
            image={manga.image}
            title={manga.title}
            leftSubtitle={manga.year ? String(manga.year) : undefined}
            rightSubtitle={
                manga.media_type && MANGA_MEDIA_TYPE[manga.media_type].title_ua
            }
            {...props}
        />
    );
};

export default MangaCard;
