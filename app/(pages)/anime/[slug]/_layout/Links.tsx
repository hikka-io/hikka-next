'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import SubHeader from '@/app/_components/SubHeader';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';

interface Props {
    extended?: boolean;
}

const ExternalLink = ({ link }: { link: Hikka.External }) => {
    return (
        <Link
            href={link.url}
            target="_blank"
            className="btn btn-secondary btn-outline flex h-auto flex-col items-center justify-center gap-2 overflow-hidden rounded-lg p-6"
        >
            <h4 className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                {link.text}
            </h4>
            <p className="label-text lowercase w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
                {link.url}
            </p>
        </Link>
    );
};

const Component = ({ extended }: Props) => {
    const [active, setActive] = useState<Hikka.External['type']>('general');
    const params = useParams();
    const queryClient = useQueryClient();
    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

    if (!anime) {
        return null;
    }

    const watchLinksData = anime.external.filter((l) => l.type === 'watch');
    const generalLinksData = anime.external.filter((l) => l.type === 'general');

    const filteredWatchLinksData = extended
        ? watchLinksData
        : watchLinksData.slice(0, 3);
    const filteredGeneralLinksData = extended
        ? generalLinksData
        : generalLinksData.slice(0, 3);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Посилання"
                href={!extended ? params.slug + '/links' : undefined}
            >
                <div className="flex gap-4">
                    {generalLinksData.length > 0 && (
                        <button
                            onClick={() => setActive('general')}
                            className={clsx(
                                'btn-badge btn btn-ghost rounded-full',
                                active === 'general' && 'btn-active',
                            )}
                        >
                            Загальне
                        </button>
                    )}
                    {watchLinksData.length > 0 && (
                        <button
                            onClick={() => setActive('watch')}
                            className={clsx(
                                'btn-badge btn btn-ghost rounded-full',
                                active === 'watch' && 'btn-active',
                            )}
                        >
                            Перегляд
                        </button>
                    )}
                </div>
            </SubHeader>
            <div
                className={clsx(
                    'grid gap-4 lg:gap-8',
                    extended
                        ? 'grid-cols-2 md:grid-cols-3'
                        : 'grid-cols-2 md:grid-cols-3',
                )}
            >
                {active === 'general' &&
                    filteredGeneralLinksData.map((link) => (
                        <ExternalLink link={link} key={link.url} />
                    ))}
                {active === 'watch' &&
                    filteredWatchLinksData.map((link) => (
                        <ExternalLink link={link} key={link.url} />
                    ))}
            </div>
        </div>
    );
};

export default Component;