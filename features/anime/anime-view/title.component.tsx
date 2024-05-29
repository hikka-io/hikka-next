'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import MaterialSymbolsStarRounded from '~icons/material-symbols/star-rounded';

import EditButton from '@/components/edit-button';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import useSession from '@/services/hooks/auth/use-session';

const Title = () => {
    const { user: loggedUser } = useSession();
    const params = useParams();
    const { data } = useAnimeInfo({ slug: String(params.slug) });

    const findYearInTitleRegex = /\(\d{4}\)/;

    if (!data) return null;

    const deleteYearFromTitle = (title: string = '') => {
        return title.replace(findYearInTitleRegex, '');
    };

    const title = deleteYearFromTitle(data.title);
    const japanTitle = deleteYearFromTitle(data.title_ja);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div>
                    <div className="flex gap-4">
                        <H2>
                            {title}{' '}
                            {data.year && (
                                <span className="font-sans font-normal">
                                    ({data.year})
                                </span>
                            )}
                        </H2>
                        {loggedUser && (
                            <EditButton
                                key={String(params.slug)}
                                slug={String(params.slug)}
                                content_type="anime"
                                className="hidden lg:flex"
                            />
                        )}
                    </div>
                    <P className="text-sm text-muted-foreground">
                        {japanTitle}
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
                    {loggedUser && (
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type="anime"
                            className="flex lg:hidden"
                        />
                    )}
                </div>
            </div>
            {data.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {data.genres.map((genre) => (
                        <span key={genre.slug} className="text-sm">
                            <Link
                                className="rounded px-1 underline decoration-primary decoration-dashed transition-colors duration-100 hover:bg-primary hover:text-primary-foreground"
                                href={`/anime?genres=${genre.slug}`}
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
