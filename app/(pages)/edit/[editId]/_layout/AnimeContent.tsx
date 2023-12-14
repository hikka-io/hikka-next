'use client';

import { format } from 'date-fns';
import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/AnimeCard';
import BaseCard from '@/app/_components/BaseCard';
import SubHeader from '@/app/_components/SubHeader';

const Component = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const edit: Hikka.Edit | undefined = queryClient.getQueryData([
        'edit',
        params.editId,
    ]);

    if (!edit || edit.content_type !== 'anime') {
        return null;
    }

    const content = edit.content as Hikka.Anime;

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Контент" variant="h4" />
            <div className="hidden w-full items-center gap-4 px-16 md:px-48 lg:flex lg:px-0">
                <AnimeCard
                    href={`/anime/` + content.slug}
                    poster={content.poster}
                />
            </div>
            <div className="flex w-full gap-4 lg:hidden">
                <div className="w-12">
                    <AnimeCard
                        href={`/anime/` + content.slug}
                        poster={content.poster}
                    />
                </div>
                <Link href={`/anime/` + content.slug}>
                    {content.title_ua || content.title_en || content.title_ja}
                </Link>
            </div>
        </div>
    );
};

export default Component;
