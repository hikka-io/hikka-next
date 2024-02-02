import * as React from 'react';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';

import SubHeader from '@/app/_components/sub-header';
import RQHydrate from '@/app/_utils/RQ-hydrate';
import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import getCharacterInfo from '@/app/_utils/api/characters/getCharacterInfo';
import getQueryClient from '@/app/_utils/getQueryClient';

import Content from '../_components/ui/content';
import EditNew from './_components/edit-new';
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

    const content: Hikka.AnimeInfo | Hikka.Character | undefined = queryClient.getQueryData([
        content_type,
        slug,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="flex flex-col gap-8">
                    <SubHeader title={`Нова правка`} />
                    <RulesAlert />
                    <EditNew
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
        </RQHydrate>
    );
};

export default Component;