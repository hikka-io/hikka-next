import * as React from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded'

interface Props {
    data: API.Collection;
    className?: string;
}

const Component = ({ data, className }: Props) => {
    return (
        <div className={cn('flex gap-4', className)}>
            <div className="w-12">
                <Link href={`/collections/${data.reference}`}>
                    <Avatar className="rounded-md w-12 h-12">
                        {data.collection[0] && (
                            <AvatarImage
                                className="object-cover"
                                src={data.collection[0].content.poster}
                            />
                        )}
                        <AvatarFallback className="rounded-md">
                            <MaterialSymbolsInfoRounded className="text-xl flex-1 text-muted-foreground" />
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
            <div className="flex flex-col justify-between gap-2 flex-1">
                <Label asChild className="line-clamp-1">
                    <Link href={`/collections/${data.reference}`}>
                        {data.title}
                    </Link>
                </Label>
                <div className="inline-flex gap-1 items-center text-muted-foreground text-xs">
                    <MaterialSymbolsGridViewRounded />
                    <Label className="text-xs">
                        {data.entries}
                    </Label>
                </div>
            </div>
        </div>
    );
};

export default Component;
