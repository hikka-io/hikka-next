import { FC, ReactNode } from 'react';

import Block from '@/components/ui/block';

import NavBar from '@/features/anime/anime-list-navbar/anime-list-navbar.component';
import Filters from '@/features/filters/anime-filters.component';

interface Props {
    children: ReactNode;
}

const AnimeListLayout: FC<Props> = async ({ children }) => {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
            <Block>
                <NavBar />
                {children}
            </Block>
            <div className="sticky top-20 order-1 hidden w-full opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                <Filters content_type="anime" sort_type="anime" />
            </div>
        </div>
    );
};

export default AnimeListLayout;
