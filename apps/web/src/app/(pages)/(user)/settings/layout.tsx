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
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <Block>
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle variant="h2">Налаштування</HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <Menu />
                </Block>
                <div className="flex flex-col gap-12">{children}</div>
            </div>
        </HydrationBoundary>
    );
};

export default SettingsLayout;
