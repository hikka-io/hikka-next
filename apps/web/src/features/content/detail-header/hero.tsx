import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';
import { getOriginalTitle } from '@hikka/core';

import ContentGenres from '@/components/content-genres';
import { usePageTitleAnchor } from '@/features/app-shell';
import { useTitle } from '@/services/session';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    className?: string;
    content_type: MainContentTypeEnum;
};

const ContentHero = ({ className, content_type }: Props) => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );
    const title = useTitle(data);
    const titleAnchor = usePageTitleAnchor();

    if (!data) {
        return null;
    }

    const originalTitle = getOriginalTitle(data);

    const titleSizeClass =
        title && title.length > 80
            ? 'text-lg leading-snug lg:text-2xl lg:leading-8'
            : title && title.length > 40
              ? 'text-xl leading-snug lg:text-2xl lg:leading-8'
              : 'text-2xl leading-8';

    return (
        <div
            className={cn('flex min-w-0 flex-col gap-4', className)}
            id="content-hero"
        >
            <div className="flex flex-col">
                <h1
                    ref={titleAnchor}
                    className={cn('font-bold', titleSizeClass)}
                >
                    {title}
                </h1>
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

export default ContentHero;
