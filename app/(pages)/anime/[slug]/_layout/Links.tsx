'use client';

import clsx from 'clsx';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import SubHeader from '@/app/_components/SubHeader';
import getAnimeInfo, {
    Response as AnimeInfoResponse,
} from '@/utils/api/anime/getAnimeInfo';

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

    const filteredData = extended ? anime.external : anime.external.slice(0, 3);

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
                        ? 'grid-cols-2 md:grid-cols-3'
                        : 'grid-cols-2 md:grid-cols-3',
                )}
            >
                {filteredData.map((link) => (
                    <Link
                        href={link.url}
                        key={link.url}
                        target="_blank"
                        className="btn btn-secondary btn-outline flex h-auto flex-col items-center justify-center gap-2 overflow-hidden rounded-lg p-6"
                    >
                        <h4 className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                            {link.text}
                        </h4>
                        <p className="label-text w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
                            {link.url}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Component;
