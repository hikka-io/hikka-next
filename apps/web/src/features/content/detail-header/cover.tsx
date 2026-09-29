import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentCover = ({ content_type }: Props) => {
    const params = useParams();
    const { data: content } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    return (
        <div
            className="z-0 flex items-center px-16 md:px-48 lg:px-0"
            id="content-cover"
        >
            <PosterCard image={content?.image} imagePreset="cardLg" />
        </div>
    );
};

export default ContentCover;
