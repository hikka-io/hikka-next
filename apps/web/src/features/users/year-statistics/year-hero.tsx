'use client';

import { useUserByUsername } from '@hikka/react';
import { FolderPen, Star } from 'lucide-react';
import { FC } from 'react';

import Completed from '@/components/icons/watch-status/completed';
import Planned from '@/components/icons/watch-status/planned';
import Watching from '@/components/icons/watch-status/watching';
import H1 from '@/components/typography/h1';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { YearStatistics } from '@/types/year-statistics';

import StatCard from './components/stat-card';

interface Props {
    data: YearStatistics;
    year: string;
    username: string;
}

const YearHero: FC<Props> = ({ data, year, username }) => {
    const { data: user } = useUserByUsername({
        username,
    });

    const totalHours = Math.floor(data.duration_total / 60);
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    const totalCompleted =
        data.status.anime.completed +
        data.status.manga.completed +
        data.status.novel.completed;

    const totalPlanned =
        data.status.anime.planned +
        data.status.manga.planned +
        data.status.novel.planned;

    return (
        <div className="flex gap-4 flex-col md:flex-row bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-lg items-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 -top-20 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 rounded-full bg-primary-foreground/5 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/10 blur-2xl" />
            </div>
            <div className="shrink-0">
                <div className="relative flex flex-col items-center gap-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <P className="text-primary-foreground uppercase tracking-widest">
                            Річний підсумок
                        </P>
                        <H1 className="text-6xl font-black text-primary-foreground md:text-8xl lg:text-9xl">
                            {year}
                        </H1>
                        <div className="flex items-center gap-4">
                            <Avatar className="size-10 rounded-md">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>
                                    {user?.username[0]}
                                </AvatarFallback>
                            </Avatar>
                            <H2 className="text-xl font-medium text-primary-foreground tracking-widest">
                                {username}
                            </H2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-2 flex-1 w-full">
                <StatCard
                    className="border-none"
                    icon={<Watching className="size-4 text-muted-foreground" />}
                    value={
                        totalDays > 0
                            ? `${totalDays} днів ${remainingHours} годин`
                            : `${totalHours} годин`
                    }
                    label="Переглянуто"
                />
                <StatCard
                    className="border-none"
                    icon={
                        <FolderPen className="size-4 text-muted-foreground" />
                    }
                    value={data.records_total}
                    label="Записів"
                />
                <StatCard
                    className="border-none"
                    icon={
                        <Completed className="size-4  text-muted-foreground" />
                    }
                    value={totalCompleted}
                    label="Всього завершено"
                />
                <StatCard
                    className="border-none"
                    icon={<Planned className="size-4 text-muted-foreground" />}
                    value={totalPlanned}
                    label="Всього заплановано"
                />
                {data.score?.anime?.avg && (
                    <StatCard
                        className="border-none"
                        icon={<Star className="size-4 text-muted-foreground" />}
                        value={data.score.anime.avg}
                        label="Середня оцінка аніме"
                    />
                )}
                {data.score?.manga?.avg && (
                    <StatCard
                        className="border-none"
                        icon={<Star className="size-4 text-muted-foreground" />}
                        value={data.score.manga.avg}
                        label="Середня оцінка манґи"
                    />
                )}
                {data.score?.novel?.avg && (
                    <StatCard
                        className="border-none"
                        icon={<Star className="size-4 text-muted-foreground" />}
                        value={data.score.novel.avg}
                        label="Середня оцінка ранобе"
                    />
                )}
            </div>
        </div>
    );
};

export default YearHero;
