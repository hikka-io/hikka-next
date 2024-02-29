'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useEdit } from '@/app/(pages)/edit/page.hooks';
import AnimeCard from '@/components/anime-card';
import SubHeader from '@/components/sub-header';


const Component = () => {
    const params = useParams();

    const { data: edit } = useEdit(String(params.editId));

    if (!edit || edit.content_type !== 'anime') {
        return null;
    }

    const content = edit.content as API.Anime;

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