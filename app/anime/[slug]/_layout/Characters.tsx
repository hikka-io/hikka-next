'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';
import Link from 'next/link';
import BaseCard from '@/app/_components/BaseCard';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['characters', params.slug],
        queryFn: () => getAnimeCharacters({ slug: String(params.slug) }),
    });

    if (!data || !data.list || data.list.length === 0) {
        return null;
    }

    const filteredData = extended
        ? data.list
        : data.list.filter((ch) => ch.main).slice(0, 6);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3>{extended ? 'Персонажі' : 'Головні Персонажі'}</h3>
                {!extended && (
                    <Link
                        href={params.slug + '/characters'}
                        className="btn btn-badge btn-ghost btn-square"
                    >
                        <MaterialSymbolsArrowRightAltRounded className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-6 grid-cols-3 gap-4 md:gap-8">
                {filteredData.map((ch) => (
                    <BaseCard
                        key={ch.character.slug}
                        // href={`/characters/${ch.character.slug}`}
                        poster={ch.character.image}
                        title={
                            ch.character.name_ua ||
                            ch.character.name_en ||
                            ch.character.name_ja
                        }
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;
