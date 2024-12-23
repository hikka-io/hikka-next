'use client';

import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import HorizontalCard from '@/components/ui/horizontal-card';

interface Props {}

const PopularAuthors: FC<Props> = () => {
    return (
        <Block>
            <Header title="Популярні автори" />
            <div className="flex flex-col gap-6">
                <HorizontalCard
                    imageRatio={1}
                    image="https://cdn.hikka.io/avatar.jpg"
                    title="MatthewBishop"
                    descriptionClassName="line-clamp-2"
                    description="ATTACK HELICOPTER"
                    href={'/u/MatthewBishop'}
                />
                <HorizontalCard
                    imageRatio={1}
                    image="https://cdn.hikka.io/avatar.jpg"
                    title="makovka"
                    descriptionClassName="line-clamp-2"
                    description="О ні... тільки не у вушко..."
                    href={'/u/makovka'}
                />
                <HorizontalCard
                    imageRatio={1}
                    image="https://cdn.hikka.io/avatar.jpg"
                    title="foggimon"
                    descriptionClassName="line-clamp-2"
                    description="Не претендую на звання експерта чи критика. Роблю те, що мені подобається, і буду радий, якщо мої огляди стануть комусь у нагоді."
                    href={'/u/foggimon'}
                />
            </div>
        </Block>
    );
};

export default PopularAuthors;
