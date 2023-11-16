'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import Link from 'next/link';
import clsx from "clsx";
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded'

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

    const filteredData = extended ? data.external : data.external.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h3>Посилання</h3>
                {!extended && (
                    <Link href={params.slug + "/links"} className="btn btn-badge btn-ghost btn-square">
                        <MaterialSymbolsArrowRightAltRounded className="text-2xl" />
                    </Link>
                )}
            </div>
            <div className={clsx("grid gap-4 md:gap-8", extended ? "md:grid-cols-4 grid-cols-2" : "md:grid-cols-4 grid-cols-2")}>
                {filteredData.map((link) => (
                    <Link
                        href={link.url}
                        key={link.url}
                        className="overflow-hidden rounded-lg p-6 gap-2 flex flex-col items-center justify-center btn h-auto btn-outline btn-secondary"
                    >
                        <h4 className="w-full whitespace-nowrap overflow-hidden overflow-ellipsis">{link.text}</h4>
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
