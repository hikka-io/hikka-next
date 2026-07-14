import type { GenreResponse, MainContentTypeEnum } from '@hikka/api';

import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type Props = {
    content_type: MainContentTypeEnum;
    genres: Pick<GenreResponse, 'slug' | 'name_ua'>[];
    className?: string;
};

const ContentGenres = ({ content_type, genres, className }: Props) => {
    if (genres.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-wrap gap-1.5', className)}>
            {genres.map((genre) => (
                <Link
                    key={genre.slug}
                    className={cn(badgeVariants({ variant: 'secondary' }))}
                    to={`/${content_type}`}
                    search={{ genres: [genre.slug] }}
                >
                    {genre.name_ua}
                </Link>
            ))}
        </div>
    );
};

export default ContentGenres;
