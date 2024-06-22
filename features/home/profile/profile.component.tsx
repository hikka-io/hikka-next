import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';

import Block from '@/components/ui/block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Anime from './anime';
import Manga from './manga';
import Novel from './novel';

const Profile = () => {
    return (
        <Block>
            <Tabs defaultValue="anime" className="flex flex-col flex-1">
                <TabsList className="w-full">
                    <TabsTrigger value="anime" className="flex-1 flex gap-2">
                        <MaterialSymbolsPlayArrowRounded className="size-4" />{' '}
                        Аніме
                    </TabsTrigger>
                    <TabsTrigger value="manga" className="flex-1 flex gap-2">
                        <MaterialSymbolsPalette className="size-4" /> Манґа
                    </TabsTrigger>
                    <TabsTrigger value="novel" className="flex-1 flex gap-2">
                        <MaterialSymbolsMenuBookRounded className="size-4" />{' '}
                        Ранобе
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="anime" className="flex-1">
                    <Anime />
                </TabsContent>
                <TabsContent value="manga" className="flex-1">
                    <Manga />
                </TabsContent>
                <TabsContent value="novel" className="flex-1">
                    <Novel />
                </TabsContent>
            </Tabs>
        </Block>
    );
};

export default Profile;
