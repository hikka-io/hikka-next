'use client';

import { ContentTypeEnum } from '@hikka/client';

import ContentCard from '@/components/content-card/content-card';

import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Cover = ({ content_type }: Props) => {
    const params = useParams();
    const { data: content } = CONTENT_CONFIG[content_type].useInfo(
        String(params.slug),
    );

    return (
        <div className="z-0 flex items-center px-16 md:px-48 lg:px-0">
            <ContentCard
                image={content?.image}
                imageProps={{
                    width: 480,
                    height: 686,
                    sizes: '(min-width: 1280px) 306px, (min-width: 1024px) 212px, (min-width: 768px) 352px, (min-width: 640px) 480px, calc(100vw - 160px)',
                }}
            />
        </div>
    );
};

export default Cover;
