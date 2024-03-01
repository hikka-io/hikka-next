import * as React from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';

import Link from 'next/link';

import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';

interface Props {
    data: API.Collection;
    className?: string;
}

const Component = ({ data, className }: Props) => {
    return (
        <div className={cn('flex gap-4', className)}>
            <div className="w-12">
                <BaseCard
                    containerClassName={cn(
                        data.nsfw && 'blur-sm hover:blur-none',
                    )}
                    href={`/collections/${data.reference}`}
                    poster={data.collection[0].content.poster}
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2 items-center">
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
                        <div className="w-2 h-2 rounded-full bg-warning" />
                    )}
                    {data.nsfw && (
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                    )}
                </div>
                <p
                    className={cn(
                        'text-muted-foreground text-xs line-clamp-1',
                        data.spoiler && 'blur-sm hover:blur-none',
                    )}
                >
                    {data.description}
                </p>
                <div className="inline-flex gap-2 items-center text-muted-foreground text-xs">
                    <div className="flex gap-1">
                        <MaterialSymbolsGridViewRounded />
                        <Label className="text-xs">{data.entries}</Label>
                    </div>
                    <div className="flex gap-1">
                        <IconamoonCommentFill />
                        <Label className="text-xs">{data.comments_count}</Label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
