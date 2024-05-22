import { FC, ReactNode } from 'react';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import NavBar from '@/features/anime/anime-list-navbar/anime-list-navbar';
import Filters from '@/features/filters/anime-filters';

interface Props {
    children: ReactNode;
}

const AnimeListLayout: FC<Props> = async ({ children }) => {
    return (
        <div>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                <Block>
                    <NavBar />
                    {children}
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full p-0 opacity-60 transition-opacity hover:opacity-100 lg:order-2 lg:block">
                    <Filters type="anime" className="px-4" />
                </Card>
            </div>
        </div>
    );
};

export default AnimeListLayout;
