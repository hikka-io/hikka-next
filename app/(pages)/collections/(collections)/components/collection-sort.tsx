'use client';

import * as React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import createQueryString from '@/utils/createQueryString';

const CollectionSort = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sort = searchParams.get('sort');

    const handleChangeSort = (value: string) => {
        router.push(
            '/collections?' +
                createQueryString(
                    'sort',
                    value,
                    new URLSearchParams(searchParams),
                ).toString(),
        );
    };

    return (
        <Tabs
            defaultValue={sort || 'system_ranking'}
            onValueChange={handleChangeSort}
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="system_ranking">Популярні</TabsTrigger>
                <TabsTrigger value="created">Нові</TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default CollectionSort;
