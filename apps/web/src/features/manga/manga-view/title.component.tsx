'use client';

import { useMangaBySlug } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

const Title = () => {
    const params = useParams();
    const { data } = useMangaBySlug({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
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
                        {data.title_original}
                    </P>
                </div>
                <div className="flex flex-col gap-2">
                    {data.score > 0 && (
                        <div className="flex items-start gap-2">
                            <div className="font-display text-4xl font-bold">
                                {data.score}
                            </div>

                            <MaterialSymbolsStarRounded className="text-2xl" />
                        </div>
                    )}
                </div>
            </div>
            {data.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {data.genres.map((genre) => (
                        <span key={genre.slug} className="text-sm">
                            <Link
                                className="rounded px-1 underline decoration-primary decoration-dashed transition-colors duration-100 hover:bg-primary hover:text-primary-foreground"
                                href={`/manga?genres=${genre.slug}`}
                            >
                                {genre.name_ua}
                            </Link>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Title;
