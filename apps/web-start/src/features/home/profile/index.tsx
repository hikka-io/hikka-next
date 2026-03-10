'use client';

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

import AnimeWatchlist from './components/anime-watchlist';
import MangaReadlist from './components/manga-readlist';
import NovelReadlist from './components/novel-readlist';

const Profile = () => {
    const { user: loggedUser } = useSession();

    return (
        <Card>
            <Block>
                <Header href={`/u/${loggedUser?.username}/list`}>
                    <HeaderContainer>
                        <HeaderTitle>Мій список</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <Tabs defaultValue="anime" className="flex flex-col gap-4">
                    <TabsList className="w-fit justify-start">
                        <TabsTrigger value="anime" className="flex gap-2">
                            <MaterialSymbolsAnimatedImages className="size-4" />{' '}
                            Аніме
                        </TabsTrigger>
                        <TabsTrigger value="manga" className="flex gap-2">
                            <MaterialSymbolsPalette className="size-4" /> Манґа
                        </TabsTrigger>
                        <TabsTrigger value="novel" className="flex gap-2">
                            <MaterialSymbolsMenuBookRounded className="size-4" />{' '}
                            Ранобе
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="anime" className="flex-1">
                        <AnimeWatchlist />
                    </TabsContent>
                    <TabsContent value="manga" className="flex-1">
                        <MangaReadlist />
                    </TabsContent>
                    <TabsContent value="novel" className="flex-1">
                        <NovelReadlist />
                    </TabsContent>
                </Tabs>
            </Block>
        </Card>
    );
};

export default Profile;
