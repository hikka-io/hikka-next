import { ContentTypeEnum, EditContent, EditContentType } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import {
    prefetchAnimeBySlug,
    prefetchCharacterBySlug,
    prefetchMangaBySlug,
    prefetchNovelBySlug,
    prefetchPersonBySlug,
} from '@hikka/react/server';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Content from '@/features/edit/edit-content/edit-content.component';
import EditForm from '@/features/edit/edit-forms/edit-create-form.component';
import RulesAlert from '@/features/edit/edit-rules-alert.component';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const EditNewPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    const { content_type, slug } = searchParams;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    if (
        !content_type &&
        !slug &&
        Array.isArray(slug) &&
        Array.isArray(content_type)
    ) {
        permanentRedirect('/edit');
    }

    let content: EditContent | undefined;

    if (content_type === ContentTypeEnum.ANIME) {
        content = await prefetchAnimeBySlug({
            slug: String(slug),
            clientConfig,
            queryClient,
        });
    }

    if (content_type === ContentTypeEnum.MANGA) {
        content = await prefetchMangaBySlug({
            slug: String(slug),
            clientConfig,
            queryClient,
        });
    }

    if (content_type === ContentTypeEnum.NOVEL) {
        content = await prefetchNovelBySlug({
            slug: String(slug),
            clientConfig,
            queryClient,
        });
    }

    if (content_type === ContentTypeEnum.CHARACTER) {
        content = await prefetchCharacterBySlug({
            slug: String(slug),
            clientConfig,
            queryClient,
        });
    }

    if (content_type === ContentTypeEnum.PERSON) {
        content = await prefetchPersonBySlug({
            slug: String(slug),
            clientConfig,
            queryClient,
        });
    }

    if (!content) {
        permanentRedirect('/edit');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Block>
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle>Нова правка</HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <RulesAlert />
                    <EditForm
                        slug={slug as string}
                        content_type={content_type as EditContentType}
                        content={content}
                    />
                </Block>
                <div className="flex flex-col gap-12">
                    <Content
                        slug={slug as string}
                        content_type={content_type as EditContentType}
                        content={content}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditNewPage;
