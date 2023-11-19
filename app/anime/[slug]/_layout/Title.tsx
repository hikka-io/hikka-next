'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import AnimeEditModal from '@/app/anime/[slug]/_layout/AnimeEditModal';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import { useModalContext } from '@/utils/providers/ModalProvider';
import clsx from "clsx";
import AnimeEditListModal from "@/app/anime/[slug]/_layout/AnimeEditListModal";

const Component = () => {
    const { switchModal } = useModalContext();
    const { secret } = useAuthContext();
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const EditButton = ({ className }: { className?: string }) => {
        return (
            <button
                onClick={() => switchModal('animeEditList')}
                className={clsx("btn btn-xs btn-secondary btn-square btn-outline", className)}
            >
                <MaterialSymbolsEditRounded />
            </button>
        );
    };

    if (!data) {
        return null;
    }

    return (
        <div className="flex justify-between">
            <div>
                <div className="flex gap-4 items-center">
                    <h2>
                        {data.title_ua || data.title_en || data.title_ja}{' '}
                        {data.start_date && (
                            <span className="font-normal">
                                (
                                {new Date(data.start_date * 1000).getFullYear()}
                                )
                            </span>
                        )}
                    </h2>
                    {secret && <EditButton className="hidden md:flex" />}
                </div>
                <p className="mt-2">{data.title_ja}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
                {data.score > 0 && (
                    <p className="text-4xl font-bold">{data.score}</p>
                )}
                {secret && <EditButton className="md:hidden flex" />}
            </div>
            {secret && <AnimeEditListModal />}
        </div>
    );
};

export default Component;
