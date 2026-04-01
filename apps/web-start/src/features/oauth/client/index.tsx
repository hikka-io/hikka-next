'use client';

import { useClientByReference } from '@hikka/react';
import { FC } from 'react';

import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { cn } from '@/utils/cn';
import { SCOPES, SCOPE_GROUPS } from '@/utils/constants/oauth';

import Scope from './components/scope';

interface Props {}

const Client: FC<Props> = () => {
    const { reference, scope } = useFilterSearch<{
        reference?: string;
        scope?: string;
    }>();

    const scopes = scope
        ?.split(',')
        .map(
            (s) =>
                SCOPE_GROUPS.find((sg) => sg.slug === s)?.scopes ||
                SCOPES.find((sg) => sg.slug === s),
        )
        .flat()
        .filter((s) => s) as Hikka.Scope[];

    const { data: client } = useClientByReference({
        reference: reference!,
    });

    return (
        <Card className="w-full">
            <div>
                <Label>{client?.name}</Label>
                <p
                    className={cn(
                        'text-sm',
                        client?.verified
                            ? 'text-success-foreground'
                            : 'text-warning-foreground',
                    )}
                >
                    {client?.verified
                        ? 'Перевірений застосунок'
                        : 'Невідомий застосунок'}
                </p>
            </div>
            <Separator className="-mx-4 w-auto" />
            <div className="gradient-mask-b-90-d -m-4 flex max-h-60 flex-col gap-4 overflow-scroll p-4">
                {scopes.map((s) => (
                    <Scope key={s.slug} scope={s} />
                ))}
            </div>
        </Card>
    );
};

export default Client;
