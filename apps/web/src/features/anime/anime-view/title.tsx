'use client';

import { useAnimeBySlug } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import MaterialSymbolsStarRounded from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

import { cn } from '@/utils/utils';

const Title = ({ className }: { className?: string }) => {
    const params = useParams();
    const { data } = useAnimeBySlug({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
                <div>
                    <H2>
                        {data.title}{' '}
                        {data.start_date && (
                            <span className="font-sans font-normal">
                                (
                                {new Date(data.start_date * 1000).getFullYear()}
                                )
                            </span>
                        )}
                    </H2>

                    <P className="text-sm text-muted-foreground">
                        {data.title_ja}
                    </P>
                </div>
                {data.score > 0 && (
                    <div className="flex items-center gap-1 rounded-md border bg-secondary/20 px-2">
                        <div className="font-display text-xl font-bold">
                            {data.score}
                        </div>

                        <MaterialSymbolsStarRounded className="text-xl text-yellow-400" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                {data.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {data.genres.map((genre) => (
                            <span key={genre.slug} className="text-sm">
                                <Link
                                    className="rounded px-1 underline decoration-primary-foreground decoration-dashed transition-colors duration-100 hover:bg-primary-border hover:text-primary-foreground"
                                    href={`/anime?genres=${genre.slug}`}
                                >
                                    {genre.name_ua}
                                </Link>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Title;
