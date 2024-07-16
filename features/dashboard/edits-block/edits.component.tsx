'use client';

import Link from 'next/link';
import MaterialAnimatedImages from '~icons/material-symbols/animated-images';
import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
import MaterialSymbolsDeleteOutlineRounded from '~icons/material-symbols/delete-outline-rounded';
import MaterialSymbolsFormatListBulletedRounded from '~icons/material-symbols/format-list-bulleted-rounded';
import MaterialSymbolsHourglassBottomRounded from '~icons/material-symbols/hourglass-bottom-rounded';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsPersonOutlineRounded from '~icons/material-symbols/person-outline-rounded';
import MaterialSymbolsShuffleRounded from '~icons/material-symbols/shuffle-rounded';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useSession from '@/services/hooks/auth/use-session';
import useTodoAnime from '@/services/hooks/edit/todo/use-todo-anime';
import useEditList from '@/services/hooks/edit/use-edit-list';

import Header from '../components/header';
import CardItem from './card-item.component';

const Edits = () => {
    const { user: loggedUser } = useSession();
    const { data: pendingEdits } = useEditList({ status: 'pending' });
    const { data: acceptedEdits } = useEditList({ status: 'accepted' });
    const { data: deniedEdits } = useEditList({ status: 'denied' });
    const { data: closedEdits } = useEditList({ status: 'closed' });
    const { data: ownEdits } = useEditList({ author: loggedUser?.username });
    const { pagination: todoAnimeTitles } = useTodoAnime({
        param: 'title_ua',
    });
    const { pagination: todoAnimeDesc } = useTodoAnime({
        param: 'synopsis_ua',
    });

    return (
        <div className="flex w-2/3 flex-col gap-12">
            <Header title="Правки" href="/edit">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon-sm"
                            variant="outline"
                            className="backdrop-blur focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        >
                            <MaterialSymbolsMoreHoriz className="text-lg" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <MaterialSymbolsShuffleRounded className="mr-2 size-4" />
                                Випадкова сторінка
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent
                                    sideOffset={7}
                                    alignOffset={-5}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href="" target="_blank">
                                            <MaterialAnimatedImages className="mr-2 size-4" />
                                            Аніме
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href=""
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MaterialSymbolsPalette className="mr-2 size-4" />
                                            Манґа
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href=""
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MaterialSymbolsMenuBookRounded className="mr-2 size-4" />
                                            Ранобе
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Header>
            <div className="flex gap-6">
                <div className="flex h-fit flex-1 flex-col gap-6">
                    <Card className="flex gap-4 backdrop-blur">
                        <CardItem
                            title="Правки на розгляді"
                            href="/edit?page=1&edit_status=pending"
                            text={pendingEdits?.pagination.total}
                            icon={
                                <MaterialSymbolsHourglassBottomRounded className="text-[#f2c94c]" />
                            }
                        />
                        <Separator className="-mx-4 w-auto" />
                        <CardItem
                            title="Прийнято"
                            href="/edit?page=1&edit_status=accepted"
                            text={acceptedEdits?.pagination.total}
                            icon={
                                <MaterialSymbolsCheckRounded className="text-[#50e3c2]" />
                            }
                        />
                        <CardItem
                            title="Відхилено"
                            href="/edit?page=1&edit_status=denied"
                            text={deniedEdits?.pagination.total}
                            icon={
                                <MaterialSymbolsCloseRounded className="text-[#d93036]" />
                            }
                        />
                        <CardItem
                            title="Закрито"
                            href="/edit?page=1&edit_status=closed"
                            text={closedEdits?.pagination.total}
                            icon={
                                <MaterialSymbolsDeleteOutlineRounded className="text-muted-foreground" />
                            }
                        />
                        <CardItem
                            title="Мої"
                            href={`/edit?page=1&author=${loggedUser?.username}`}
                            text={ownEdits?.pagination.total}
                            icon={
                                <MaterialSymbolsPersonOutlineRounded className="text-muted-foreground" />
                            }
                        />
                    </Card>
                    <div className="flex flex-col gap-2">
                        <Tabs
                            defaultValue="anime"
                            className="flex flex-1 flex-col"
                        >
                            <TabsList className="w-full">
                                <TabsTrigger
                                    value="anime"
                                    className="flex flex-1 gap-2"
                                >
                                    Аніме
                                </TabsTrigger>
                                <TabsTrigger
                                    value="manga"
                                    className="flex flex-1 gap-2"
                                >
                                    Манґа
                                </TabsTrigger>
                                <TabsTrigger
                                    value="novel"
                                    className="flex flex-1 gap-2"
                                >
                                    Ранобе
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="anime" className="flex-1">
                                <Card className="flex gap-4">
                                    <CardItem
                                        title="Аніме без назви"
                                        href="/edit/content"
                                        text={todoAnimeTitles?.total}
                                        icon={
                                            <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                        }
                                    />
                                    <CardItem
                                        title="Аніме без опису"
                                        href="/edit/content?type=synopsis_ua"
                                        text={todoAnimeDesc?.total}
                                        icon={
                                            <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                        }
                                    />
                                </Card>
                            </TabsContent>
                            <TabsContent value="manga" className="flex-1">
                                <Card className="flex gap-4">
                                    <CardItem
                                        title="Манґа без назви"
                                        href=""
                                        text={-1}
                                        icon={
                                            <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                        }
                                    />
                                    <CardItem
                                        title="Манґа без опису"
                                        href=""
                                        text={-1}
                                        icon={
                                            <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                        }
                                    />
                                </Card>
                            </TabsContent>
                            <TabsContent value="novel" className="flex-1">
                                <Card className="flex gap-4">
                                    <CardItem
                                        title="Ранобе без назви"
                                        href=""
                                        text={-1}
                                        icon={
                                            <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                        }
                                    />
                                    <CardItem
                                        title="Ранобе без опису"
                                        href=""
                                        text={-1}
                                        icon={
                                            <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                        }
                                    />
                                </Card>
                            </TabsContent>
                        </Tabs>
                        <Card className="flex gap-4">
                            <CardItem
                                title="Персонажі без імені"
                                href=""
                                text={-1}
                                icon={
                                    <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                }
                            />
                            <CardItem
                                title="Персонажі без опису"
                                href=""
                                text={-1}
                                icon={
                                    <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                }
                            />
                            <Separator className="-mx-4 w-auto" />
                            <CardItem
                                title="Люди без імені"
                                href=""
                                text={-1}
                                icon={
                                    <MaterialSymbolsFormatListBulletedRounded className="text-muted-foreground" />
                                }
                            />
                        </Card>
                    </div>
                </div>
                <Card className="flex flex-1 justify-between backdrop-blur">
                    {/* Max items - 6 */}
                    <div className="flex flex-col gap-5">
                        {/* <RequestItem
                            title="Химерні пригоди ДжоДжо Частина 7: Перегони «Сталева куля»"
                            poster="https://cdn.hikka.io/content/manga/jojo-no-kimyou-na-bouken-part-7-steel-ball-run-0bdd18/236_1QKsVrG7C55F_TSnBg.jpg"
                            type="Манґа"
                            href=""
                            requests={354}
                        />
                        <RequestItem
                            title="Монстр"
                            poster="https://cdn.hikka.io/content/manga/monster-54bb37/_MV1VLheaPyS6sUPQDXTPQ.jpg"
                            type="Манґа"
                            href=""
                            requests={258}
                        /> */}
                    </div>
                    <Button variant="accent">Всі запити (-1)</Button>
                </Card>
            </div>
        </div>
    );
};

export default Edits;
