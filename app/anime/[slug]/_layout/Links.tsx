'use client';

import { useParams } from 'next/navigation';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import getAnimeInfo, {Response as AnimeInfoResponse} from '@/utils/api/anime/getAnimeInfo';
import Link from 'next/link';
import clsx from 'clsx';
import SubHeader from '@/app/_components/SubHeader';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const queryClient = useQueryClient();
    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

    if (!anime) {
        return null;
    }

    const filteredData = extended ? anime.external : anime.external.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Посилання"
                href={!extended ? params.slug + '/links' : undefined}
            />
            <div
                className={clsx(
                    'grid gap-4 lg:gap-8',
                    extended
                        ? 'md:grid-cols-4 grid-cols-2'
                        : 'md:grid-cols-4 grid-cols-2',
                )}
            >
                {filteredData.map((link) => (
                    <Link
                        href={link.url}
                        key={link.url}
                        className="overflow-hidden rounded-lg p-6 gap-2 flex flex-col items-center justify-center btn h-auto btn-outline btn-secondary"
                    >
                        <h4 className="w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {link.text}
                        </h4>
                        <p className="opacity-60 text-xs w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {link.url}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Component;
