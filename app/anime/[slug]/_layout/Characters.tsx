'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import EntryCard from '@/app/_components/EntryCard';
import ArrowRight from '@/app/_components/icons/ArrowRight';
import Link from "next/link";

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
                    <Link replace href={params.slug + "/characters"} className="btn btn-sm btn-ghost btn-square">
                        <ArrowRight className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-6 grid-cols-3 gap-4 md:gap-8">
                {filteredData.map((ch) => (
                    <EntryCard
                        key={ch.character.slug}
                        href={`/characters/${ch.character.slug}`}
                        poster={ch.character.image}
                        title={ch.character.name_ua || ch.character.name_en}
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;
