import { useState } from 'react';

import type { GenreResponse, MainContentTypeEnum } from '@hikka/api';

import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type Props = {
    contentType: MainContentTypeEnum;
    genres: Pick<GenreResponse, 'slug' | 'name_ua'>[];
    maxItems?: number;
    className?: string;
};

export default function ContentGenres(props: Props) {
    const { contentType, genres, maxItems, className } = props;

    const [expanded, setExpanded] = useState(false);

    if (genres.length === 0) {
        return null;
    }

    const collapsed =
        !expanded &&
        maxItems != null &&
        maxItems > 0 &&
        genres.length > maxItems;

    const visibleGenres = collapsed ? genres.slice(0, maxItems) : genres;

    return (
        <div className={cn('flex flex-wrap gap-1.5', className)}>
            {visibleGenres.map((genre) => (
                <Link
                    key={genre.slug}
                    className={cn(badgeVariants({ variant: 'secondary' }))}
                    to={`/${contentType}`}
                    search={{ genres: [genre.slug] }}
                >
                    {genre.name_ua}
                </Link>
            ))}
            {collapsed && (
                <button
                    type="button"
                    className={cn(
                        badgeVariants({ variant: 'secondary' }),
                        'cursor-pointer bg-transparent hover:bg-secondary',
                    )}
                    onClick={() => setExpanded(true)}
                >
                    +{genres.length - maxItems}
                </button>
            )}
        </div>
    );
}
