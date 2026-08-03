import type { MainContentTypeEnum } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

type Props = {
    content_type: MainContentTypeEnum;
};

const Cover = ({ content_type }: Props) => {
    const params = useParams();
    const { data: content } = CONTENT_CONFIG[content_type].useInfo(
        String(params.slug),
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

export default Cover;
