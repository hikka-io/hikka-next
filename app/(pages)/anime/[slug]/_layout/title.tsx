'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import AnimeEditListModal from '@/app/_layout/modals/anime-editlist-modal';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { ANIME_NAV_ROUTES } from '@/utils/constants';
import useIsMobile from '@/utils/hooks/useIsMobile';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import { useSettingsContext } from '@/utils/providers/settings-provider';


const EditButton = ({ className }: { className?: string }) => {
    const { openModal } = useModalContext();

    return (
        <Button
            variant="outline"
            size="icon-xs"
            onClick={() =>
                openModal({
                    content: <AnimeEditListModal />,
                    type: 'sheet',
                    title: 'Список правок',
                })
            }
            className={clsx(className)}
        >
            <MaterialSymbolsEditRounded />
        </Button>
    );
};

const Component = () => {
    const { titleLanguage } = useSettingsContext();
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const divRef = useRef<HTMLDivElement>(null);
    const { secret } = useAuthContext();
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    useEffect(() => {
        if (
            isMobile &&
            divRef.current &&
            ANIME_NAV_ROUTES.some(
                (r) =>
                    r.url !== '' &&
                    pathname === '/anime/' + params.slug + r.url,
            )
        ) {
            divRef.current.scrollIntoView(true);
        }
    }, [pathname]);

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4" ref={divRef}>
                <div>
                    <div className="flex gap-4">
                        <h2>
                            {data[titleLanguage!] ||
                                data.title_ua ||
                                data.title_en ||
                                data.title_ja ||
                                ''}{' '}
                            {data.start_date && (
                                <span className="font-sans font-normal">
                                    (
                                    {new Date(
                                        data.start_date * 1000,
                                    ).getFullYear()}
                                    )
                                </span>
                            )}
                        </h2>
                        {secret && <EditButton className="hidden lg:flex" />}
                    </div>
                    <p className="mt-2">{data.title_ja}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {data.score > 0 && (
                        <p className="font-display text-4xl font-bold">
                            {data.score}
                        </p>
                    )}
                    {secret && <EditButton className="flex lg:hidden" />}
                </div>
            </div>
            {data.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {data.genres.map((genre) => (
                        <span key={genre.slug} className="text-sm">
                            <Link
                                className="rounded-sm underline decoration-primary decoration-dashed transition-colors duration-100 hover:bg-primary hover:text-primary-foreground"
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

export default Component;