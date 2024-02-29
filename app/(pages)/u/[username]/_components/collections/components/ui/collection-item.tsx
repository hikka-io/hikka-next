import * as React from 'react';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
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
                    href={`/collections/${data.reference}`}
                    poster={data.collection[0].content.poster}
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <Label asChild className={cn("line-clamp-1", data.spoiler && "blur-sm hover:blur-none")}>
                    <Link href={`/collections/${data.reference}`}>
                        {data.title}
                    </Link>
                </Label>
                <p className={cn("text-muted-foreground text-xs line-clamp-1", data.spoiler && "blur-sm hover:blur-none")}>{data.description}</p>
                <div className="inline-flex gap-1 items-center text-muted-foreground text-xs">
                    <MaterialSymbolsGridViewRounded />
                    <Label className="text-xs">{data.entries}</Label>
                </div>
            </div>
        </div>
    );
};

export default Component;
