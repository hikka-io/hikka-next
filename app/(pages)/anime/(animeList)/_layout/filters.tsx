'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { usePathname, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { Combobox } from '@/app/_components/combobox';
import Tooltip from '@/app/_components/tooltip';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Slider } from '@/app/_components/ui/slider';
import { Switch } from '@/app/_components/ui/switch';
import getAnimeGenres from '@/utils/api/anime/getAnimeGenres';
import {
    AGE_RATING,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants';
import useRouter from '@/utils/useRouter';


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

    const createQueryString = useCallback(
        (name: string, value: string | string[] | boolean) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');

            if (value) {
                if (Array.isArray(value)) {
                    params.delete(name);
                    value.forEach((v) => params.append(name, String(v)));
                } else {
                    params.set(name, String(value));
                }
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    const handleFilterSelect = (value: string, data: string[]) => {
        const newData = [...data];

        if (!newData.includes(value)) {
            newData.push(value);
        } else {
            newData.splice(newData.indexOf(value), 1);
        }

        return newData;
    };

    const clearFilters = () => {
        router.replace(`${pathname}`);
        setSelectingYears(YEARS.map((y) => String(y)));
    };

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(name, value);
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
            <div className="flex w-full flex-col items-start gap-8 overflow-y-scroll lg:overflow-y-visible">
                <div className="w-full flex flex-col gap-2">
                    <Label>Жанр</Label>
                    {genresList && genresList.list.length > 0 ? (
                        <Combobox
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
                        <Label htmlFor="auk-translated">
                            Перекладено українською
                        </Label>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label>Статус</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(RELEASE_STATUS).map((slug) => (
                            <Button
                                size="badge"
                                onClick={() =>
                                    handleChangeParam(
                                        'statuses',
                                        handleFilterSelect(slug, statuses),
                                    )
                                }
                                key={slug}
                                variant={
                                    statuses.includes(slug)
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                {RELEASE_STATUS[slug as Hikka.Status].title_ua}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label>Тип</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(MEDIA_TYPE).map((slug) => (
                            <Button
                                size="badge"
                                onClick={() =>
                                    handleChangeParam(
                                        'types',
                                        handleFilterSelect(slug, types),
                                    )
                                }
                                key={slug}
                                variant={
                                    types.includes(slug) ? 'accent' : 'outline'
                                }
                            >
                                {MEDIA_TYPE[slug as Hikka.MediaType].title_ua}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label>Сезон</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(SEASON).map((slug) => (
                            <Button
                                size="badge"
                                onClick={() =>
                                    handleChangeParam(
                                        'seasons',
                                        handleFilterSelect(slug, seasons),
                                    )
                                }
                                key={slug}
                                variant={
                                    seasons.includes(slug)
                                        ? 'accent'
                                        : 'outline'
                                }
                            >
                                {SEASON[slug as Hikka.Season].title_ua}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label>Рейтинг</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(AGE_RATING).map((slug) => (
                            <Button
                                size="badge"
                                onClick={() =>
                                    handleChangeParam(
                                        'ratings',
                                        handleFilterSelect(slug, ageRatings),
                                    )
                                }
                                key={slug}
                                variant={
                                    ageRatings.includes(slug)
                                        ? 'accent'
                                        : 'outline'
                                }
                            >
                                {AGE_RATING[slug as Hikka.AgeRating].title_ua}
                                <Tooltip
                                    placement="top"
                                    className="mr-1 p-1"
                                    data={
                                        <p className="text-sm">
                                            {
                                                AGE_RATING[
                                                    slug as Hikka.AgeRating
                                                ].description
                                            }
                                        </p>
                                    }
                                >
                                    <div>
                                        <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                    </div>
                                </Tooltip>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Label>Рік виходу</Label>
                    <div className="flex items-center gap-4">
                        <p className="badge">{selectingYears[0]}</p>
                        <Slider
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
                        <p className="badge">{selectingYears[1]}</p>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-4 flex w-full gap-2 lg:relative">
                <Button
                    variant="outline"
                    className="flex-1 shadow-md bg-background"
                    onClick={clearFilters}
                >
                    <AntDesignClearOutlined /> Очистити
                </Button>
            </div>
        </div>
    );
};

export default Component;