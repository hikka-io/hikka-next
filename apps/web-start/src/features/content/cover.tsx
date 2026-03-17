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
                imagePreset="cardLg"
            />
        </div>
    );
};

export default Cover;
