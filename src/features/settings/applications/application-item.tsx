import { format } from 'date-fns/format';
import { FC } from 'react';

import MaterialSymbolsVerifiedRounded from '@/components/icons/material-symbols/MaterialSymbolsVerifiedRounded';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import ClientEditButton from './client-edit-button';

interface Props {
    client: API.Client;
}

const ApplicationItem: FC<Props> = ({ client }) => {
    return (
        <Card className="justify-between gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <H5 className="line-clamp-1">{client.name}</H5>
                    {client.verified && (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                                <div className="rounded-sm border border-secondary/60 bg-secondary/30 p-1 text-xs font-bold text-secondary-foreground backdrop-blur">
                                    <MaterialSymbolsVerifiedRounded className="text-primary" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Label className="text-sm">Верифіковано</Label>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {client.description && (
                    <P className="line-clamp-6 text-sm text-muted-foreground">
                        {client.description}
                    </P>
                )}
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col">
                    <P className="text-xs text-muted-foreground opacity-60">
                        {format(new Date(client.updated * 1000), 'd MMMM yyyy')}
                    </P>
                </div>
                <ClientEditButton client={client} />
            </div>
        </Card>
    );
};

export default ApplicationItem;
