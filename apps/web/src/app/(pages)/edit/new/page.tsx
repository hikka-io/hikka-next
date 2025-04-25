import { EditContent, EditContentType } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    prefetchAnimeInfo,
    prefetchCharacterInfo,
    prefetchMangaInfo,
    prefetchNovelInfo,
    prefetchPersonInfo,
} from '@hikka/react';
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

    if (content_type === 'anime') {
        content = await prefetchAnimeInfo({ slug: String(slug), clientConfig });
    }

    if (content_type === 'manga') {
        content = await prefetchMangaInfo({ slug: String(slug), clientConfig });
    }

    if (content_type === 'novel') {
        content = await prefetchNovelInfo({ slug: String(slug), clientConfig });
    }

    if (content_type === 'character') {
        content = await prefetchCharacterInfo({
            slug: String(slug),
            clientConfig,
        });
    }

    if (content_type === 'person') {
        content = await prefetchPersonInfo({
            slug: String(slug),
            clientConfig,
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
