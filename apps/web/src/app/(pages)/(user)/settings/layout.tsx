import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { Metadata } from 'next';
import { FC, PropsWithChildren } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Menu from '@/features/settings/menu.component';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

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

const SettingsLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">Налаштування</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <Menu />
                    <div className="flex flex-col gap-12">{children}</div>
                </div>
            </Block>
        </HydrationBoundary>
    );
};

export default SettingsLayout;
