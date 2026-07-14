import type { MainContentTypeEnum } from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

type Props = {
    content_type: MainContentTypeEnum;
    className?: string;
};

const HeroPoster = ({ content_type, className }: Props) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data) {
        return null;
    }

    return (
        <div
            className={cn('w-48 shrink-0', className)}
            id="content-hero-poster"
        >
            <ContentCard image={data.image} imagePreset="cardLg" />
        </div>
    );
};

export default HeroPoster;
