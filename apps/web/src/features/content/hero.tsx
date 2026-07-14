import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { badgeVariants } from '@/components/ui/badge';
import { useTitle } from '@/features/auth/hooks/use-title';
import { cn } from '@/utils/cn';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { Link, useParams } from '@/utils/navigation';

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

    const originalTitle =
        data.data_type === ContentTypeEnum.ANIME
            ? 'title_ja' in data
                ? data.title_ja
                : null
            : 'title_original' in data
              ? (data as { title_original?: string | null }).title_original
              : null;

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
            {data.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {data.genres.map((genre) => (
                        <Link
                            key={genre.slug}
                            className={cn(
                                badgeVariants({ variant: 'secondary' }),
                            )}
                            to={`/${content_type}`}
                            search={{ genres: [genre.slug] }}
                        >
                            {genre.name_ua}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Hero;
