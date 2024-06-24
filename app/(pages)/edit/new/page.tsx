import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';

import Content from '@/features/edit/edit-content/edit-content.component';
import EditForm from '@/features/edit/edit-forms/edit-create-form.component';
import RulesAlert from '@/features/edit/edit-rules-alert.component';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import getCharacterInfo from '@/services/api/characters/getCharacterInfo';
import getMangaInfo from '@/services/api/manga/getMangaInfo';
import getNovelInfo from '@/services/api/novel/getNovelInfo';
import getPersonInfo from '@/services/api/people/getPersonInfo';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const EditNewPage: FC<Props> = async ({
    searchParams: { content_type, slug },
}) => {
    const queryClient = await getQueryClient();

    if (
        !content_type &&
        !slug &&
        Array.isArray(slug) &&
        Array.isArray(content_type)
    ) {
        redirect('/edit');
    }

    if (content_type === 'anime') {
        await queryClient.prefetchQuery({
            queryKey: ['anime', slug],
            queryFn: () =>
                getAnimeInfo({
                    params: {
                        slug: String(slug),
                    },
                }),
        });
    }

    if (content_type === 'manga') {
        await queryClient.prefetchQuery({
            queryKey: ['manga', slug],
            queryFn: () =>
                getMangaInfo({
                    params: {
                        slug: String(slug),
                    },
                }),
        });
    }

    if (content_type === 'novel') {
        await queryClient.prefetchQuery({
            queryKey: ['novel', slug],
            queryFn: () =>
                getNovelInfo({
                    params: {
                        slug: String(slug),
                    },
                }),
        });
    }

    if (content_type === 'character') {
        await queryClient.prefetchQuery({
            queryKey: ['character', slug],
            queryFn: () =>
                getCharacterInfo({
                    params: {
                        slug: String(slug),
                    },
                }),
        });
    }

    if (content_type === 'person') {
        await queryClient.prefetchQuery({
            queryKey: ['person', slug],
            queryFn: () =>
                getPersonInfo({
                    params: {
                        slug: String(slug),
                    },
                }),
        });
    }

    const content: API.MainContent | undefined = queryClient.getQueryData([
        content_type,
        slug,
    ]);

    if (!content) {
        redirect('/edit');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Block>
                    <Header title="Нова правка" />
                    <RulesAlert />
                    <EditForm
                        slug={slug as string}
                        content_type={content_type as API.ContentType}
                        content={content}
                    />
                </Block>
                <div className="flex flex-col gap-12">
                    <Content
                        slug={slug as string}
                        content_type={content_type as API.ContentType}
                        content={content}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default EditNewPage;
