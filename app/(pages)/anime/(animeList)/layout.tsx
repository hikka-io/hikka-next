import { ReactNode } from 'react';

import Filters from '../../../../components/filters/anime-filters';
import NavBar from '@/app/(pages)/anime/(animeList)/components/navbar';

interface Props {
    children: ReactNode;
}

const AnimeListLayout = async ({ children }: Props) => {
    return (
        <div>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <div className="flex flex-col gap-8">
                    <NavBar />
                    {children}
                </div>
                <div className="sticky top-20 order-1 hidden w-full rounded-md border border-secondary/60 bg-secondary/30 opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                    <Filters type="anime" className="px-4" />
                </div>
            </div>
        </div>
    );
};

export default AnimeListLayout;
