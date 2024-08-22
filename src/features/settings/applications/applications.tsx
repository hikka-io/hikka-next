'use client';

import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';

import MaterialSymbolsСomputerOutlineRounded from '~icons/material-symbols/computer-outline-rounded';
import MaterialSymbolsNightlightOutlineRounded from '~icons/material-symbols/nightlight-outline-rounded';
import MaterialSymbolsSunnyOutlineRounded from '~icons/material-symbols/sunny-outline-rounded';
import MaterialSymbolsVerified from '~icons/material-symbols/verified';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import format from 'date-fns/format';
import Card from '@/components/ui/card';
import H5 from '@/components/typography/h5';
import MDViewer from '@/components/markdown/viewer/MD-viewer';

import ClientEditButton from './client-edit-button';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';


import ClientEditModal from '@/features/modals/client-edit-modal';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

import LoadMoreButton from '@/components/load-more-button';
import Header from '@/components/ui/header';

import { useSettingsContext } from '@/services/providers/settings-provider';
import { useModalContext } from '@/services/providers/modal-provider';
import useClients from '@/services/hooks/client/use-clients';



const Component = () => {
    const { data, isFetching } = useClients();
    
    return (
        <div className="flex w-full flex-col gap-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {data &&
                    data.list.length > 0 &&
                    data.list.map((item) => (
                        <Card
                            className="gap-6 justify-between"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <H5 className="line-clamp-1">{item.name}</H5>
                                    {!item.verified && (
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger>
                                                <div className="rounded-sm border border-secondary/60 bg-secondary/30 p-1
                                                                    text-xs font-bold text-secondary-foreground backdrop-blur">
                                                    <MaterialSymbolsVerified className="text-primary" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <Label className="text-sm">
                                                    Верифіковано
                                                </Label>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                                {item.description && (
                                    <Label className="line-clamp-6 text-xs text-muted-foreground lg:line-clamp-6">
                                        {item.description}
                                    </Label>
                                )}
                            </div>
                            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="flex flex-1 flex-col">
                                    <Label className="text-xs text-muted-foreground">
                                    {format(
                                        new Date(item.updated * 1000),
                                        'd MMMM yyyy',
                                    )}
                                    </Label>
                                </div>
                                <ClientEditButton item={item} />
                            </div>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
};

export default Component;