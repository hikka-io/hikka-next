import * as React from 'react';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import SubHeader from '@/components/sub-header';
import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import getCharacterInfo from '@/services/api/characters/getCharacterInfo';
import getQueryClient from '@/utils/getQueryClient';

import Content from '../_components/ui/content';
import EditForm from '../_components/edit-form';
import RulesAlert from './_components/rules-alert';


interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const Component = async ({ searchParams: { content_type, slug } }: Props) => {
    const queryClient = getQueryClient();

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
            queryFn: () => getAnimeInfo({ slug: String(slug) }),
        });
    }

    if (content_type === 'character') {
        await queryClient.prefetchQuery({
            queryKey: ['character', slug],
            queryFn: () => getCharacterInfo({ slug: String(slug) }),
        });
    }

    const content: Hikka.AnimeInfo | Hikka.Character | undefined =
        queryClient.getQueryData([content_type, slug]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="flex flex-col gap-8">
                    <SubHeader title={`Нова правка`} />
                    <RulesAlert />
                    <EditForm
                        slug={slug as string}
                        content_type={content_type as Hikka.ContentType}
                    />
                </div>
                <div className="flex flex-col gap-12">
                    <Content
                        slug={slug as string}
                        content_type={content_type as Hikka.ContentType}
                        content={content}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Component;
