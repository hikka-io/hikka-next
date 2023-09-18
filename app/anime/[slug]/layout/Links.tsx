'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import Link from 'next/link';
import clsx from "clsx";

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    if (!data) {
        return null;
    }

    const filteredData = extended ? data.external : data.external.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <h3>Посилання</h3>
            <div className={clsx("grid gap-4", extended ? "md:grid-cols-4 grid-cols-2" : "md:grid-cols-5 grid-cols-2")}>
                {filteredData.map((link) => (
                    <Link
                        href={link.url}
                        key={link.url}
                        className="rounded-lg p-6 gap-2 flex flex-col items-center justify-center border transition border-secondary/30 hover:border-secondary"
                    >
                        <h4>{link.text}</h4>
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
