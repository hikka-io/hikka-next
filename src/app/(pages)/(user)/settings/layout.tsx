import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import Menu from '@/features/settings/menu.component';

import getQueryClient from '@/utils/get-query-client';

import _generateMetadata, { MetadataProps } from './layout.metadata';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
): Promise<Metadata> {
    return await _generateMetadata();
}

const SettingsLayout: FC<Props> = async ({ params: { slug }, children }) => {
    const queryClient = getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Block>
                <Header title="Налаштування" variant="h2" />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <Menu />
                    <div className="flex flex-col gap-12">{children}</div>
                </div>
            </Block>
        </HydrationBoundary>
    );
};

export default SettingsLayout;