import type { MainContentTypeEnum } from '@hikka/api';

import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import ContentGenres from './content-genres';
import { getOriginalTitle } from './get-original-title';

type TitleProps = {
    className?: string;
    content_type: MainContentTypeEnum;
};

const Title = ({ className, content_type }: TitleProps) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));
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
            <ContentGenres content_type={content_type} genres={data.genres} />
        </div>
    );
};

export default Title;
