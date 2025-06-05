'use client';

import { useClientByReference } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { SCOPES, SCOPE_GROUPS } from '@/utils/constants/oauth';
import { cn } from '@/utils/utils';

import Scope from './scope';

interface Props {}

const Client: FC<Props> = () => {
    const searchParams = useSearchParams();

    const reference = searchParams.get('reference')!;
    const scopes = searchParams
        .get('scope')
        ?.split(',')
        .map(
            (s) =>
                SCOPE_GROUPS.find((sg) => sg.slug === s)?.scopes ||
                SCOPES.find((sg) => sg.slug === s),
        )
        .flat()
        .filter((s) => s) as Hikka.Scope[];

    const { data: client } = useClientByReference({
        reference,
    });

    return (
        <Card className="w-full">
            <div>
                <Label>{client?.name}</Label>
                <P
                    className={cn(
                        'text-sm',
                        client?.verified ? 'text-success' : 'text-warning',
                    )}
                >
                    {client?.verified
                        ? 'Перевірений застосунок'
                        : 'Невідомий застосунок'}
                </P>
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
