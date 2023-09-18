'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import EntryCard from '@/app/components/EntryCard';
import Link from "next/link";
import ArrowRight from "@/app/components/icons/ArrowRight";

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['franchise', params.slug],
        queryFn: () => getAnimeFranchise({ slug: String(params.slug) }),
    });

    if (!data || !data.list || data.list.length === 0) {
        return null;
    }

    const filterSelfData = data.list.filter((anime) => anime.slug !== params.slug);
    const filteredData = extended ? filterSelfData : filterSelfData.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3>{`Пов'язане`}</h3>
                {!extended && (
                    <Link replace href={params.slug + "/franchise"} className="btn btn-sm">
                        Більше <ArrowRight className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
                {filteredData.map((anime) => (
                    <EntryCard
                        key={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={anime.title_ua ||anime.title_en}
                        posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;
