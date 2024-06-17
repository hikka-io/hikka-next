import { FC } from 'react';

import ContentCard, {
    Props as ContentCardProps,
} from '@/components/content-card/content-card';

import { NOVEL_MEDIA_TYPE } from '@/utils/constants';

interface Props extends ContentCardProps {
    novel: API.Novel | API.NovelInfo;
}

const NovelCard: FC<Props> = ({ novel, ...props }) => {
    return (
        <ContentCard
            read={novel.read ? novel.read[0] : undefined}
            slug={novel.slug}
            content_type="novel"
            href={`/novel/${novel.slug}`}
            image={novel.image}
            title={novel.title}
            leftSubtitle={novel.year ? String(novel.year) : undefined}
            rightSubtitle={
                novel.media_type && NOVEL_MEDIA_TYPE[novel.media_type].title_ua
            }
            {...props}
        />
    );
};

export default NovelCard;
