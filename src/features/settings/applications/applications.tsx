'use client';

import format from 'date-fns/format';

import Card from '@/components/ui/card';
import H5 from '@/components/typography/h5';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import MaterialSymbolsVerified from '~icons/material-symbols/verified';

import ClientEditButton from './client-edit-button';
import useClients from '@/services/hooks/client/use-clients';


const Component = () => {
    const { data } = useClients();

    if (!data) {
        return (
            <div className="flex flex-col w-full gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {Array(3).fill(0).map((_, i) => (
                        <div className="flex flex-col gap-8 rounded-lg border-secondary/60 bg-secondary/30 p-4">
                            <div className="flex flex-col gap-4 animate-pulse">
                                <div className="w-32 h-4 rounded-lg bg-secondary/60" />
                                <div className="flex flex-col gap-2">
                                    {Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="h-2 rounded-lg bg-secondary/60" />
                                    ))}
                                </div>
                            </div>
                            <div className="h-2 w-16 animate-pulse rounded-lg bg-secondary/60" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {data?.list.length > 0 && data.list.map((item) => (
                    <Card className="gap-6 justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <H5 className="line-clamp-1">{item.name}</H5>
                                {item.verified && (
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <div className="rounded-sm border border-secondary/60 bg-secondary/30 p-1 text-xs font-bold text-secondary-foreground backdrop-blur">
                                                <MaterialSymbolsVerified className="text-primary" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <Label className="text-sm">Верифіковано</Label>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                            {item.description && (
                                <Label className="line-clamp-6 text-xs text-muted-foreground">
                                    {item.description}
                                </Label>
                            )}
                        </div>
                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex flex-1 flex-col">
                                <Label className="text-xs text-muted-foreground">
                                    {format(new Date(item.updated * 1000), 'd MMMM yyyy')}
                                </Label>
                            </div>
                            <ClientEditButton item={item} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Component;