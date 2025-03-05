import MaterialSymbolsAnimatedImages from '@/components/icons/material-symbols/MaterialSymbolsAnimatedImages';
import MaterialSymbolsMenuBookRounded from '@/components/icons/material-symbols/MaterialSymbolsMenuBookRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import Block from '@/components/ui/block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AnimeWatchlist from './anime-watchlist';
import MangaReadlist from './manga-readlist';
import NovelReadlist from './novel-readlist';

const Profile = () => {
    return (
        <Block>
            <Tabs defaultValue="anime" className="flex flex-1 flex-col">
                <TabsList className="w-full">
                    <TabsTrigger value="anime" className="flex flex-1 gap-2">
                        <MaterialSymbolsAnimatedImages className="size-4" />{' '}
                        Аніме
                    </TabsTrigger>
                    <TabsTrigger value="manga" className="flex flex-1 gap-2">
                        <MaterialSymbolsPalette className="size-4" /> Манґа
                    </TabsTrigger>
                    <TabsTrigger value="novel" className="flex flex-1 gap-2">
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
    );
};

export default Profile;
