'use client';

import { useAnimeBySlug } from '@hikka/react';
import { useParams } from 'next/navigation';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';

import { cn } from '@/utils/utils';

const GlobalScore = ({ className }: { className?: string }) => {
    const params = useParams();
    const { data } = useAnimeBySlug({ slug: String(params.slug) });

    if (!data || data.score === 0) {
        return null;
    }

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div className="font-display text-2xl font-bold">{data.score}</div>

            <MaterialSymbolsStarRounded className="text-2xl text-yellow-400" />
        </div>
    );
};

export default GlobalScore;
