import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    content_type: MainContentTypeEnum;
    className?: string;
};

const ContentHeroPoster = ({ content_type, className }: Props) => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    if (!data) {
        return null;
    }

    return (
        <div
            className={cn('w-48 shrink-0', className)}
            id="content-hero-poster"
        >
            <PosterCard image={data.image} imagePreset="cardLg" />
        </div>
    );
};

export default ContentHeroPoster;
