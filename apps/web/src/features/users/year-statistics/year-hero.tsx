'use client';

import { useUserByUsername } from '@hikka/react';
import { Bookmark, MessageCircleMore, Pencil, Star } from 'lucide-react';
import { FC } from 'react';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import Completed from '@/components/icons/watch-status/completed';
import Watching from '@/components/icons/watch-status/watching';
import H1 from '@/components/typography/h1';
import H2 from '@/components/typography/h2';
import P from '@/components/typography/p';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from '@/components/ui/image';

import { YearStatistics } from '@/types/year-statistics';
import {
    ARTICLE_DECLENSIONS,
    COLLECTION_DECLENSIONS,
    COMMENT_DECLENSIONS,
    EDIT_DECLENSIONS,
} from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n';

import StatCard from './components/stat-card';
import { YEAR } from './constants';

interface Props {
    data: YearStatistics;
    username: string;
}

const YearHero: FC<Props> = ({ data, username }) => {
    const { data: user } = useUserByUsername({
        username,
    });

    const days = Math.floor(data.duration_total / 1440);
    const remainingMinutes = data.duration_total % 1440;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    const totalCompleted =
        data.status.anime.completed +
        data.status.manga.completed +
        data.status.novel.completed;

    return (
        <div className="flex gap-4 flex-col dark:bg-gradient-to-br dark:from-primary/80 dark:via-primary/60 dark:to-primary/40 bg-secondary/20 rounded-lg items-center backdrop-blur p-6 relative overflow-hidden w-full -z-10">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 -top-20 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-primary-foreground/5 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/10 blur-2xl" />
            </div>
            <Image
                className="absolute top-6 left-6 -z-10 opacity-20"
                src="/logo-icon.png"
                alt="Logo"
                width={32}
                height={32}
            />
            <Image
                className="absolute top-24 left-24 -z-10 opacity-20"
                src="/logo-icon.png"
                alt="Logo"
                width={64}
                height={64}
            />
            <Image
                className="absolute top-6 left-64 -z-10 opacity-20"
                src="/logo-icon.png"
                alt="Logo"
                width={64}
                height={64}
            />
            <Image
                className="absolute bottom-6 left-64 -z-10 opacity-20"
                src="/logo-icon.png"
                alt="Logo"
                width={48}
                height={48}
            />
            <Image
                className="absolute bottom-12 left-6 -z-10 opacity-20"
                src="/logo-icon.png"
                alt="Logo"
                width={32}
                height={32}
            />
            <div className="relative flex flex-col items-center gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
                    <P className="text-primary-foreground uppercase tracking-widest">
                        Підсумки року
                    </P>
                    <H1 className="text-6xl font-black text-primary-foreground md:text-8xl lg:text-9xl">
                        {YEAR}
                    </H1>
                    <div className="flex items-center gap-4">
                        <Avatar className="size-10 rounded-md">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.username[0]}</AvatarFallback>
                        </Avatar>
                        <H2 className="text-xl font-medium text-primary-foreground tracking-widest">
                            {username}
                        </H2>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    {
                        <StatCard
                            className="border-none"
                            icon={
                                <Watching className="size-4 text-muted-foreground" />
                            }
                            value={
                                <span className="text-2xl font-bold">
                                    {days > 0 && `${days} `}
                                    {days > 0 && (
                                        <span className="text-sm">
                                            {getDeclensionWord(days, [
                                                'день',
                                                'дні',
                                                'днів',
                                            ])}{' '}
                                        </span>
                                    )}
                                    {hours > 0 && `${hours} `}
                                    {hours > 0 && (
                                        <span className="text-sm">
                                            {getDeclensionWord(hours, [
                                                'година',
                                                'години',
                                                'годин',
                                            ])}{' '}
                                        </span>
                                    )}
                                    {(hours === 0 || days === 0) &&
                                        `${minutes} `}
                                    {(hours === 0 || days === 0) && (
                                        <span className="text-sm">
                                            {getDeclensionWord(minutes, [
                                                'хвилина',
                                                'хвилини',
                                                'хвилин',
                                            ])}
                                        </span>
                                    )}
                                </span>
                            }
                            label="Дивились аніме"
                        />
                    }
                    {data.volumes_total > 0 && (
                        <StatCard
                            className="border-none"
                            icon={
                                <Bookmark className="size-4 text-muted-foreground" />
                            }
                            value={
                                <span className="text-2xl font-bold">
                                    {data.volumes_total}{' '}
                                    <span className="text-sm">
                                        {getDeclensionWord(data.volumes_total, [
                                            'том',
                                            'томи',
                                            'томів',
                                        ])}
                                    </span>{' '}
                                    {data.chapters_total > 0 && (
                                        <span>
                                            {data.chapters_total}{' '}
                                            <span className="text-sm">
                                                {getDeclensionWord(
                                                    data.chapters_total,
                                                    [
                                                        'розділ',
                                                        'розділи',
                                                        'розділів',
                                                    ],
                                                )}
                                            </span>
                                        </span>
                                    )}
                                </span>
                            }
                            label="Прочитали манґи та ранобе"
                        />
                    )}
                    {totalCompleted > 0 && (
                        <StatCard
                            className="border-none"
                            icon={
                                <Completed className="size-4  text-muted-foreground" />
                            }
                            value={totalCompleted}
                            label="Тайтлів завершено"
                        />
                    )}

                    {data.score?.anime?.avg && (
                        <StatCard
                            className="border-none"
                            icon={
                                <Star className="size-4 text-muted-foreground" />
                            }
                            value={data.score.anime.avg}
                            label="Середня оцінка аніме"
                        />
                    )}
                    {data.score?.manga?.avg && (
                        <StatCard
                            className="border-none"
                            icon={
                                <Star className="size-4 text-muted-foreground" />
                            }
                            value={data.score.manga.avg}
                            label="Середня оцінка манґи"
                        />
                    )}
                    {data.score?.novel?.avg && (
                        <StatCard
                            className="border-none"
                            icon={
                                <Star className="size-4 text-muted-foreground" />
                            }
                            value={data.score.novel.avg}
                            label="Середня оцінка ранобе"
                        />
                    )}
                    {data.edits_percentile !== null && data.edits_count > 0 && (
                        <StatCard
                            className="border-none"
                            icon={
                                <Pencil className="size-4 text-muted-foreground" />
                            }
                            value={
                                <span className="text-2xl font-bold">
                                    {data.edits_count}{' '}
                                    <span className="text-sm">
                                        {getDeclensionWord(
                                            data.edits_count,
                                            EDIT_DECLENSIONS,
                                        )}
                                    </span>
                                </span>
                            }
                            label={`Більше ніж ${(100 - Number(data.edits_percentile)).toFixed(0)}% користувачів`}
                        />
                    )}
                    {data.comments_percentile !== null &&
                        data.comments_count > 0 && (
                            <StatCard
                                className="border-none"
                                icon={
                                    <MessageCircleMore className="size-4 text-muted-foreground" />
                                }
                                value={
                                    <span className="text-2xl font-bold">
                                        {data.comments_count}{' '}
                                        <span className="text-sm">
                                            {getDeclensionWord(
                                                data.comments_count,
                                                COMMENT_DECLENSIONS,
                                            )}
                                        </span>
                                    </span>
                                }
                                label={`Більше ніж ${100 - data.comments_percentile}% користувачів`}
                            />
                        )}
                    {data.collections_percentile !== null &&
                        data.collections_count > 0 && (
                            <StatCard
                                className="border-none"
                                icon={
                                    <MaterialSymbolsGridViewRounded className="size-4 text-muted-foreground" />
                                }
                                value={
                                    <span className="text-2xl font-bold">
                                        {data.collections_count}{' '}
                                        <span className="text-sm">
                                            {getDeclensionWord(
                                                data.collections_count,
                                                COLLECTION_DECLENSIONS,
                                            )}
                                        </span>
                                    </span>
                                }
                                label={`Більше ніж ${100 - data.collections_percentile}% користувачів`}
                            />
                        )}
                    {data.articles_percentile !== null &&
                        data.articles_count > 0 && (
                            <StatCard
                                className="border-none"
                                icon={
                                    <MaterialSymbolsDynamicFeedRounded className="size-4 text-muted-foreground" />
                                }
                                value={
                                    <span className="text-2xl font-bold">
                                        {data.articles_count}{' '}
                                        <span className="text-sm">
                                            {getDeclensionWord(
                                                data.articles_count,
                                                ARTICLE_DECLENSIONS,
                                            )}
                                        </span>
                                    </span>
                                }
                                label={`Більше ніж ${100 - data.articles_percentile}% користувачів`}
                            />
                        )}
                </div>
            </div>
            <P className="text-primary-foreground uppercase tracking-widest text-sm">
                hikka.io
            </P>
        </div>
    );
};

export default YearHero;
