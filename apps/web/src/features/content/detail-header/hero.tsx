import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';

import ContentGenres from '@/components/content-genres';
import { usePageTitleAnchor } from '@/features/app-shell';
import { useTitle } from '@/features/auth/hooks/use-title';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

import { getOriginalTitle } from './get-original-title';

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentHero = ({ content_type }: Props) => {
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
            ? 'text-lg leading-snug'
            : title && title.length > 40
              ? 'text-xl leading-snug'
              : 'text-2xl';

    return (
        <div className="flex min-w-0 flex-col gap-4" id="content-hero">
            <div className="flex flex-col">
                <h2 ref={titleAnchor} className={titleSizeClass}>
                    {title}
                </h2>
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
