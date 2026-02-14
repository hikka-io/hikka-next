import { ContentTypeEnum } from '@hikka/client';
import { FC, ReactNode } from 'react';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';

import { ReadFilters } from '@/features/filters';
import { NovelListNavbar as NavBar } from '@/features/novel';

interface Props {
    children: ReactNode;
}

const NovelListLayout: FC<Props> = async ({ children }) => {
    return (
        <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
            <Block>
                <Header>
                    <HeaderTitle variant="h2">Каталог ранобе</HeaderTitle>
                </Header>
                <NavBar />
                {children}
            </Block>
            <div className="sticky top-20 order-1 hidden w-full max-h-[calc(100vh-9rem)] rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden lg:order-2 lg:flex">
                <ReadFilters
                    content_type={ContentTypeEnum.NOVEL}
                    sort_type="novel"
                />
            </div>
        </div>
    );
};

export default NovelListLayout;
