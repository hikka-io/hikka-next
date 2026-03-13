'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';

import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ReadingTracker from './components/reading-tracker';
import WatchingTracker from './components/watching-tracker';

const WidgetTracker = () => {
    const { user } = useSession();

    if (!user) return null;

    return (
        <Card className="backdrop-blur bg-secondary/20 snap-center ">
            <Block>
                <Header href={`/u/${user.username}/list`}>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Мій список</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <Tabs defaultValue="anime" className="flex flex-col gap-4">
                    <TabsList className="w-full">
                        <TabsTrigger value="anime" className="flex gap-2">
                            <MaterialSymbolsAnimatedImages className="size-4" />
                            Аніме
                        </TabsTrigger>
                        <TabsTrigger value="manga" className="flex gap-2">
                            <MaterialSymbolsPalette className="size-4" />
                            Манґа
                        </TabsTrigger>
                        <TabsTrigger value="novel" className="flex gap-2">
                            <MaterialSymbolsMenuBookRounded className="size-4" />
                            Ранобе
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="anime" className="flex-1">
                        <WatchingTracker />
                    </TabsContent>
                    <TabsContent value="manga" className="flex-1">
                        <ReadingTracker contentType={ContentTypeEnum.MANGA} />
                    </TabsContent>
                    <TabsContent value="novel" className="flex-1">
                        <ReadingTracker contentType={ContentTypeEnum.NOVEL} />
                    </TabsContent>
                </Tabs>
            </Block>
        </Card>
    );
};

export default WidgetTracker;
