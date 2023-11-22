'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import BaseCard from '@/app/_components/BaseCard';
import { format } from 'date-fns';
import Link from 'next/link';
import SubHeader from "@/app/_components/SubHeader";
import AnimeCard from "@/app/_components/AnimeCard";

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
            <div className="w-full flex gap-4 items-center">
                <AnimeCard href={`/anime/` + content.slug} poster={content.poster} />
            </div>
        </div>
    );
};

export default Component;
