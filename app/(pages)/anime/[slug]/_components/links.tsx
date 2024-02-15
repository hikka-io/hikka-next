'use client';

import clsx from 'clsx';
import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';

interface Props {
    extended?: boolean;
}

const ExternalLink = ({ link }: { link: Hikka.External }) => {
    return (
        <Button variant="outline" className="p-6" asChild>
            <Link
                href={link.url}
                target="_blank"
                className="flex h-auto flex-col items-center justify-center text-center gap-2 overflow-hidden rounded-lg"
            >
                <h4 className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {link.text}
                </h4>
                <p className="lowercase w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
                    {link.url}
                </p>
            </Link>
        </Button>
    );
};

const Component = ({ extended }: Props) => {
    const [active, setActive] = useState<Hikka.External['type']>('general');
    const params = useParams();
    const { data: anime } = useAnimeInfo(String(params.slug));

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
                <div className="flex gap-4 flex-wrap">
                    {generalLinksData.length > 0 && (
                        <Button
                            size="badge"
                            variant={
                                active === 'general' ? 'secondary' : 'outline'
                            }
                            onClick={() => setActive('general')}
                            className={clsx(
                                'rounded-full overflow-hidden flex-1',
                            )}
                        >
                            <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                                Загальне
                            </span>
                        </Button>
                    )}
                    {watchLinksData.length > 0 && (
                        <Button
                            size="badge"
                            variant={
                                active === 'watch' ? 'secondary' : 'outline'
                            }
                            onClick={() => setActive('watch')}
                        >
                            <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                                Перегляд
                            </span>
                        </Button>
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