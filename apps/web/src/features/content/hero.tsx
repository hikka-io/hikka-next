import type { MainContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import ContentGenres from './content-genres';
import { getOriginalTitle } from './get-original-title';

type Props = {
    content_type: MainContentTypeEnum;
};

const Hero = ({ content_type }: Props) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));
    const title = useTitle(data);

    if (!data) {
        return null;
    }

    const originalTitle = getOriginalTitle(data);

    const titleSizeClass =
        title && title.length > 80
            ? 'text-lg leading-snug'
            : title && title.length > 40
              ? 'text-xl leading-snug'
              : 'text-2xl';

    return (
        <div className="flex min-w-0 flex-col gap-4" id="content-hero">
            <div className="flex flex-col">
                <h2 className={titleSizeClass}>{title}</h2>
                {originalTitle && (
                    <p className="text-muted-foreground text-sm">
                        {originalTitle}
                    </p>
                )}
            </div>
            <ContentGenres contentType={content_type} genres={data.genres} />
        </div>
    );
};

export default Hero;
