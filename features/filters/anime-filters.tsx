'use client';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectSearch,
    SelectTrigger,
    SelectValue,
    groupOptions,
    renderSelectOptions,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import BadgeFilter from '@/features/filters/badge-filter';

import getAnimeGenres from '@/services/api/anime/getAnimeGenres';
import useCompanies from '@/services/hooks/companies/useCompanies';
import {
    AGE_RATING,
    GENRE_TYPES,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants';
import createQueryString from '@/utils/createQueryString';
import { cn } from '@/utils/utils';

import { Switch } from '../../components/ui/switch';

const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DEFAULT_YEAR_START = YEARS[0].toString();
const DEFAULT_YEAR_END = YEARS[1].toString();

enum RANGE {
    MIN = 'min',
    MAX = 'max',
}

interface FilterYearInputProps {
    years: string[];
    setSelectingYears: (years: string[]) => void;
    handleChangeParam: (
        name: string,
        value: string | string[] | boolean,
    ) => void;
    range: RANGE;
}

const FilterYearInput: FC<FilterYearInputProps> = ({
    years,
    setSelectingYears,
    handleChangeParam,
    range,
}) => {
    const [yearValue, setYearValue] = useState<string>(
        range === RANGE.MIN ? years[0] : years[1],
    );

    const changeYearsParams = (value: string[]) => {
        setSelectingYears(value);
        handleChangeParam('years', value);
    };

    const debouncedChangeYearsParams = (
        value: string[],
        delay: number = 400,
    ) => {
        setTimeout(() => {
            changeYearsParams(value);
        }, delay);
    };

    const resetYearIfInvalid = (
        yearValue: string,
        defaultYear: string,
        years: string[],
    ) => {
        if (
            yearValue === '' ||
            Number(yearValue) < Number(DEFAULT_YEAR_START) ||
            Number(yearValue) > Number(DEFAULT_YEAR_END)
        ) {
            setYearValue(defaultYear);
            debouncedChangeYearsParams(
                range === RANGE.MIN
                    ? [defaultYear, years[1]]
                    : [years[0], defaultYear],
            );
        }
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const digitsOnlyRegex = /^(?!0)\d+$/;
        const isInRange =
            Number(value) >= Number(DEFAULT_YEAR_START) &&
            Number(value) <= Number(DEFAULT_YEAR_END);

        if (!digitsOnlyRegex.test(value)) {
            if (range === RANGE.MIN && !value) {
                debouncedChangeYearsParams([DEFAULT_YEAR_START, years[1]]);
            }

            if (range === RANGE.MAX && !value) {
                debouncedChangeYearsParams([years[0], DEFAULT_YEAR_END]);
            }

            return setYearValue('');
        }

        if (range === RANGE.MIN) {
            if (isInRange) {
                if (Number(value) > Number(years[1])) {
                    return debouncedChangeYearsParams([years[1], value]);
                }

                debouncedChangeYearsParams([value, years[1]]);
            }
        }

        if (range === RANGE.MAX) {
            if (isInRange) {
                if (Number(value) < Number(years[0])) {
                    return debouncedChangeYearsParams([value, years[0]]);
                }

                debouncedChangeYearsParams([years[0], value]);
            }
        }

        setYearValue(value);
    };

    const handleBlur = () => {
        if (range === RANGE.MIN) {
            resetYearIfInvalid(yearValue, DEFAULT_YEAR_START, years);
        }

        if (range === RANGE.MAX) {
            resetYearIfInvalid(yearValue, DEFAULT_YEAR_END, years);
        }
    };

    useEffect(() => {
        if (yearValue) setYearValue(range === RANGE.MIN ? years[0] : years[1]);
    }, [years]);

    return (
        <Input
            value={yearValue}
            onChange={handleYearChange}
            maxLength={4}
            className={cn(
                'w-16 sm:w-16 focus-visible:ring-0 focus-visible:ring-offset-0',
            )}
            onBlur={handleBlur}
        />
    );
};

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
    const studios = searchParams.getAll('studios');
    const lang = searchParams.get('only_translated');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort') || 'score';

    const sortOptions = type === 'anime' ? SORT_ANIME : SORT_WATCHLIST;

    const { data: genresList } = useQuery({
        queryKey: ['animeGenres'],
        queryFn: () => getAnimeGenres(),
        select: (data) =>
            groupOptions(
                data.list.map((genre) => ({
                    value: genre.slug,
                    label: genre.name_ua,
                    group: GENRE_TYPES[genre.type].title_ua,
                })),
            ),
    });

    const [studioSearch, setStudioSearch] = useState<string>();
    const { data: studioList, isFetching: isStudioListFetching } = useCompanies(
        {
            type: 'studio',
            query: studioSearch,
        },
    );

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

    const handleStudioSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setStudioSearch(undefined);
            return;
        }

        setStudioSearch(keyword);
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
                                <SelectValue placeholder="Виберіть сортування..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {sortOptions.map((item) => (
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
                                {genresList && renderSelectOptions(genresList)}
                                <SelectEmpty>Жанрів не знайдено</SelectEmpty>
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
                    <Label className="text-muted-foreground">Студія</Label>
                    <Select
                        multiple
                        value={studios}
                        onValueChange={(value) =>
                            handleChangeParam('studios', value)
                        }
                        onSearch={handleStudioSearch}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Виберіть студію..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectSearch placeholder="Назва студії..." />
                            <SelectList>
                                <SelectGroup>
                                    {!isStudioListFetching &&
                                        studioList?.list.map((studio) => (
                                            <SelectItem
                                                key={studio.slug}
                                                value={studio.slug}
                                            >
                                                {studio.name}
                                            </SelectItem>
                                        ))}
                                    <SelectEmpty>
                                        {isStudioListFetching
                                            ? 'Завантаження...'
                                            : 'Студій не знайдено'}
                                    </SelectEmpty>
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-full flex-col gap-4">
                    <Label className="text-muted-foreground">Рік виходу</Label>
                    <div className="flex items-center gap-4">
                        <FilterYearInput
                            years={selectingYears}
                            setSelectingYears={setSelectingYears}
                            range={RANGE.MIN}
                            handleChangeParam={handleChangeParam}
                        />
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
                            min={Number(DEFAULT_YEAR_START)}
                            max={Number(DEFAULT_YEAR_END)}
                            minStepsBetweenThumbs={0}
                            value={selectingYears.map((y) => Number(y))}
                        />
                        <FilterYearInput
                            years={selectingYears}
                            setSelectingYears={setSelectingYears}
                            range={RANGE.MAX}
                            handleChangeParam={handleChangeParam}
                        />
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
        </ScrollArea>
    );
};

export default AnimeFilters;
