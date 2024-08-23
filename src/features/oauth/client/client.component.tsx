'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { SCOPES, SCOPE_GROUPS } from '@/utils/constants/oauth';

import Scope from './scope';

interface Props {}

const Client: FC<Props> = () => {
    const searchParams = useSearchParams();

    const scopes =
        searchParams
            .get('scope')
            ?.split(',')
            .map(
                (s) =>
                    SCOPE_GROUPS.find((sg) => sg.slug === s)?.scopes ||
                    SCOPES.find((sg) => sg.slug === s),
            )
            .flat()
            .filter((s) => s) || [];

    return (
        <Card className="w-full">
            <div>
                <Label>AniUA</Label>
                <P className="text-warning text-sm">Невідомий застосунок</P>
            </div>
            <Separator className="-mx-4 w-auto" />
            <div className="flex flex-col gap-4 max-h-60 overflow-scroll -m-4 p-4 gradient-mask-b-90-d">
                {scopes.map((s) => (
                    <Scope scope={s} />
                ))}
            </div>
        </Card>
    );
};

export default Client;
