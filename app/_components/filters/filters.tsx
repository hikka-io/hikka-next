'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import { Combobox } from '@/app/_components/ui/combobox';
import { Label } from '@/app/_components/ui/label';
import { Slider } from '@/app/_components/ui/slider';
import { Switch } from '@/app/_components/ui/switch';
import getAnimeGenres from '@/app/_utils/api/anime/getAnimeGenres';
import {
    AGE_RATING,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/app/_utils/constants';
import createQueryString from '@/app/_utils/createQueryString';

import BadgeFilter from './_components/ui/badge-filter';


const YEARS: [number, number] = [1980, new Date().getFullYear()];

const Component = () => {
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

    const { data: genresList } = useQuery({
        queryKey: ['animeGenres'],
        queryFn: () => getAnimeGenres(),
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
            new URLSearchParams(searchParams),
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
        <div
            className={clsx(
                'flex flex-col items-start gap-8',
                // 'lg:absolute lg:top-0',
                'border-t border-t-transparent',
                'transition',
            )}
        >
            <div className="flex w-full flex-col items-start gap-8">
                <div className="w-full flex flex-col gap-4">
                    <Label className="text-muted-foreground">Жанр</Label>
                    {genresList && genresList.list.length > 0 ? (
                        <Combobox
                            searchPlaceholder="Назва жанру..."
                            selectPlaceholder="Виберіть жанр/жанри..."
                            clearable
                            options={genresList.list.map((genre) => ({
                                value: genre.slug,
                                label: genre.name_ua || genre.name_en,
                            }))}
                            multiple
                            value={genres}
                            onChange={(value) =>
                                handleChangeParam('genres', value as string[])
                            }
                        />
                    ) : (
                        <div className="animate-pulse h-12 w-full rounded-lg bg-secondary/60" />
                    )}
                </div>
                <div className="w-full">
                    <div className="flex items-center gap-2">
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
                        <Label htmlFor="uk-translated">
                            Перекладено українською
                        </Label>
                    </div>
                </div>
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
                <div className="w-full flex flex-col gap-4">
                    <Label className="text-muted-foreground">Рік виходу</Label>
                    <div className="flex items-center gap-4">
                        <Label className="badge w-9">{selectingYears[0]}</Label>
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
                        <Label className="badge w-9">{selectingYears[1]}</Label>
                    </div>
                </div>
            </div>
            <Button
                variant="outline"
                className="shadow-md bg-background lg:bg-transparent sticky lg:relative bottom-4 lg:flex w-full"
                onClick={clearFilters}
            >
                <AntDesignClearOutlined /> Очистити
            </Button>
        </div>
    );
};

export default Component;