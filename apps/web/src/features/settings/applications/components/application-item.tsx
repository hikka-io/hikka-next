import type { FC } from 'react';

import { format } from 'date-fns/format';

import type { ClientResponse } from '@hikka/api';

import MaterialSymbolsVerifiedRounded from '@/components/icons/material-symbols/MaterialSymbolsVerifiedRounded';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import ClientEditButton from './client-edit-button';

type Props = {
    client: ClientResponse;
};

const ApplicationItem: FC<Props> = ({ client }) => {
    return (
        <Card className="justify-between gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <h5 className="line-clamp-1">{client.name}</h5>
                    {client.verified && (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                                <div className="rounded-sm border border-border surface-inset p-1 font-bold text-xs">
                                    <MaterialSymbolsVerifiedRounded className="text-primary-foreground" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Label className="text-sm">Верифіковано</Label>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {client.description && (
                    <p className="line-clamp-6 text-muted-foreground text-sm">
                        {client.description}
                    </p>
                )}
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col">
                    <p className="text-muted-foreground text-xs opacity-60">
                        {format(new Date(client.updated * 1000), 'd MMMM yyyy')}
                    </p>
                </div>
                <ClientEditButton client={client} />
            </div>
        </Card>
    );
};

export default ApplicationItem;
