import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';

import Link from 'next/link';

import Small from '@/components/typography/small';
import EntryCard from '@/components/entry-card/entry-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';
import parseTextFromMarkDown from '@/utils/parseTextFromMarkDown';

interface Props {
    data: API.Collection;
    className?: string;
}

const Component = ({ data, className }: Props) => {
    const description = parseTextFromMarkDown(data.description);

    return (
        <div className={cn('flex gap-4', className)}>
            <div className="w-12">
                <EntryCard
                    containerClassName={cn(
                        data.nsfw && 'blur-sm hover:blur-none',
                    )}
                    href={`/collections/${data.reference}`}
                    poster={data.collection[0].content.poster}
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label
                        asChild
                        className={cn(
                            'line-clamp-1',
                            data.spoiler && 'blur-sm hover:blur-none',
                        )}
                    >
                        <Link href={`/collections/${data.reference}`}>
                            {data.title}
                        </Link>
                    </Label>
                    {data.spoiler && (
                        <div className="size-2 rounded-full bg-warning" />
                    )}
                    {data.nsfw && (
                        <div className="size-2 rounded-full bg-destructive" />
                    )}
                </div>
                <Small
                    className={cn(
                        'truncate text-muted-foreground',
                        data.spoiler && 'blur-sm hover:blur-none',
                    )}
                >
                    {description}
                </Small>
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex gap-1">
                        <MaterialSymbolsGridViewRounded />
                        <Small>{data.entries}</Small>
                    </div>
                    <div className="flex gap-1">
                        <IconamoonCommentFill />
                        <Small>{data.comments_count}</Small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
