'use client';

import clsx from 'clsx';
import * as React from 'react';
import { FC, Fragment, useEffect, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import BadgeFilter from '@/components/filters/components/ui/badge-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSearch,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import getAnimeGenres from '@/services/api/anime/getAnimeGenres';
import {
    AGE_RATING,
    GENRE_TYPES,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants';
import createQueryString from '@/utils/createQueryString';
import { cn } from '@/utils/utils';

import { Switch } from '../ui/switch';

const YEARS: [number, number] = [1965, new Date().getFullYear()];

interface Props {
    className?: string;
    type: 'anime' | 'watchlist';
}

const SORT_ANIME = [
    {
        label: 'Загальна оцінка',
        value: 'score',
    },
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'Тип',
        value: 'media_type',
    },
];

const SORT_WATCHLIST = [
    ...SORT_ANIME,
    {
        label: 'К-сть епізодів',
        value: 'watch_episodes',
    },
    {
        label: 'Дата додавання',
        value: 'watch_created',
    },
    {
        label: 'Власна оцінка',
        value: 'watch_score',
    },
];

const AnimeFilters: FC<Props> = ({ className, type }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('only_translated');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort') || 'score';

    const { data: genresList } = useQuery({
        queryKey: ['animeGenres'],
        queryFn: () => getAnimeGenres(),
        select: (data) =>
            data.list.reduce<Record<API.GenreType, API.Genre[]>>(
                (acc, genre) => {
                    if (!acc[genre.type]) {
                        acc[genre.type] = [];
                    }
                    acc[genre.type].push(genre);
                    return acc;
                },
                {} as Record<API.GenreType, API.Genre[]>,
            ),
    });

    const [selectingYears, setSelectingYears] = useState<string[]>(
        years.length > 0 ? years : YEARS.map((y) => String(y)),
    );

    const clearFilters = () => {
        router.replace(`${pathname}`);
        setSelectingYears(YEARS.map((y) => String(y)));
    };

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(
            name,
            value,
            createQueryString(
                'page',
                '1',
                createQueryString(
                    'iPage',
                    '1',
                    new URLSearchParams(searchParams),
                ),
            ),
        );
        router.replace(`${pathname}?${query}`);
    };

    useEffect(() => {
        if (JSON.stringify(selectingYears) !== JSON.stringify(years)) {
            setSelectingYears(
                years.length > 0 ? years : YEARS.map((y) => String(y)),
            );
        }
    }, [searchParams]);

    return (
        <ScrollArea
            className={cn(
                'flex flex-col items-start gap-8',
                'border-t border-t-transparent',
                'transition',
                'h-full lg:max-h-[calc(100vh-6rem)]',
                className,
            )}
        >
            <div className="flex w-full flex-col items-start gap-8 py-4">
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">Сортування</Label>
                    <div className="flex gap-2">
                        <Select
                            value={[sort]}
                            onValueChange={(value) =>
                                handleChangeParam('sort', value[0])
                            }
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Виберіть тип сортування..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {(type === 'anime'
                                            ? SORT_ANIME
                                            : SORT_WATCHLIST
                                        ).map((item) => (
                                            <SelectItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                                handleChangeParam(
                                    'order',
                                    order === 'asc' ? 'desc' : 'asc',
                                )
                            }
                        >
                            <MaterialSymbolsSortRounded
                                className={clsx(
                                    order === 'asc' && '-scale-y-100',
                                )}
                            />
                        </Button>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">Жанр</Label>
                    <Select
                        multiple
                        value={genres}
                        onValueChange={(value) =>
                            handleChangeParam('genres', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Виберіть жанр/жанри..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectSearch placeholder="Назва жанру..." />
                            <SelectList>
                                {genresList &&
                                    (
                                        Object.keys(
                                            genresList,
                                        ) as API.GenreType[]
                                    ).map((type, index) => (
                                        <Fragment key={type}>
                                            {index !== 0 && <SelectSeparator />}
                                            <SelectGroup
                                                heading={
                                                    GENRE_TYPES[type].title_ua
                                                }
                                            >
                                                {genresList[type].map(
                                                    (genre) => (
                                                        <SelectItem
                                                            key={genre.slug}
                                                            value={genre.slug}
                                                        >
                                                            {genre.name_ua ||
                                                                genre.name_en}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </Fragment>
                                    ))}
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>

                {type !== 'watchlist' && (
                    <div className="w-full">
                        <div className="flex items-center justify-between gap-2">
                            <Label
                                className="text-muted-foreground"
                                htmlFor="uk-translated"
                            >
                                Перекладено українською
                            </Label>
                            <Switch
                                checked={Boolean(lang)}
                                onCheckedChange={() =>
                                    handleChangeParam(
                                        'only_translated',
                                        !Boolean(lang),
                                    )
                                }
                                id="uk-translated"
                            />
                        </div>
                    </div>
                )}
                <BadgeFilter
                    title="Статус"
                    properties={RELEASE_STATUS}
                    selected={statuses}
                    property="statuses"
                    onParamChange={handleChangeParam}
                />
                <BadgeFilter
                    title="Тип"
                    properties={MEDIA_TYPE}
                    selected={types}
                    property="types"
                    onParamChange={handleChangeParam}
                />
                <BadgeFilter
                    title="Сезон"
                    properties={SEASON}
                    selected={seasons}
                    property="seasons"
                    onParamChange={handleChangeParam}
                />
                <BadgeFilter
                    title="Рейтинг"
                    properties={AGE_RATING}
                    selected={ageRatings}
                    property="ratings"
                    onParamChange={handleChangeParam}
                />
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">Рік виходу</Label>
                    <div className="flex items-center gap-4">
                        <Label className="w-9">{selectingYears[0]}</Label>
                        <Slider
                            className="flex-1"
                            onValueCommit={(value) =>
                                handleChangeParam(
                                    'years',
                                    (value as number[]).map(String),
                                )
                            }
                            onValueChange={(value) =>
                                setSelectingYears(
                                    (value as number[]).map(String),
                                )
                            }
                            min={YEARS[0]}
                            max={YEARS[1]}
                            minStepsBetweenThumbs={0}
                            value={selectingYears.map((y) => Number(y))}
                        />
                        <Label className="w-9">{selectingYears[1]}</Label>
                    </div>
                </div>
            </div>
            <Button
                variant="secondary"
                className="sticky bottom-4 mt-8 w-full shadow-md lg:flex"
                onClick={clearFilters}
            >
                <AntDesignClearOutlined /> Очистити
            </Button>
            ; ;
        </ScrollArea>
    );
};

export default AnimeFilters;
