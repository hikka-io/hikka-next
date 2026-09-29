import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';

import ContentGenres from '@/components/content-genres';
import { useTitle } from '@/features/auth/hooks/use-title';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import { getOriginalTitle } from './get-original-title';

type TitleProps = {
    className?: string;
    content_type: MainContentTypeEnum;
};

const ContentTitle = ({ className, content_type }: TitleProps) => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );
    const title = useTitle(data);

    if (!data) {
        return null;
    }

    const originalTitle = getOriginalTitle(data);

    return (
        <div
            className={cn('flex flex-col justify-between gap-4', className)}
            id="content-title"
        >
            <div className="flex flex-col">
                <h2>{title}</h2>

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

export default ContentTitle;
