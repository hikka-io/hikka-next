'use client';

import { FC } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

interface Props {}

const PopularAuthors: FC<Props> = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Популярні автори</HeaderTitle>
                </HeaderContainer>
            </Header>
            <div className="flex flex-col gap-6">
                <HorizontalCard href={'/u/MatthewBishop'}>
                    <HorizontalCardImage
                        imageRatio={1}
                        image="https://cdn.hikka.io/avatar.jpg"
                    />
                    <HorizontalCardContainer>
                        <HorizontalCardTitle>MatthewBishop</HorizontalCardTitle>
                        <HorizontalCardDescription className="line-clamp-2">
                            ATTACK HELICOPTER
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCard>

                <HorizontalCard href={'/u/makovka'}>
                    <HorizontalCardImage
                        imageRatio={1}
                        image="https://cdn.hikka.io/avatar.jpg"
                    />
                    <HorizontalCardContainer>
                        <HorizontalCardTitle>makovka</HorizontalCardTitle>
                        <HorizontalCardDescription className="line-clamp-2">
                            О ні... тільки не у вушко...
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCard>

                <HorizontalCard href={'/u/foggimon'}>
                    <HorizontalCardImage
                        imageRatio={1}
                        image="https://cdn.hikka.io/avatar.jpg"
                    />
                    <HorizontalCardContainer>
                        <HorizontalCardTitle>foggimon</HorizontalCardTitle>
                        <HorizontalCardDescription className="line-clamp-2">
                            Не претендую на звання експерта чи критика. Роблю
                            те, що мені подобається, і буду радий, якщо мої
                            огляди стануть комусь у нагоді.
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCard>
            </div>
        </Block>
    );
};

export default PopularAuthors;
