'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { Button } from '@/components/ui/button';
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
    renderSelectOptions,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import useCompanies from '@/services/hooks/companies/use-companies';
import useGenres from '@/services/hooks/genres/use-genres';
import {
    AGE_RATING,
    ANIME_MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants';
import createQueryString from '@/utils/create-query-string';

import BadgeFilter from './badge-filter';
import CollapsibleFilter from './collapsible-filter';
import YearFilterInput from './year-filter-input';

const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DEFAULT_YEAR_START = YEARS[0].toString();
const DEFAULT_YEAR_END = YEARS[1].toString();

enum RANGE {
    MIN = 'min',
    MAX = 'max',
}

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

    const { data: genresList } = useGenres();

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
        <ScrollArea className="flex h-full flex-col lg:max-h-[calc(100vh-6rem)]">
            <div className="flex flex-col">
                <CollapsibleFilter defaultOpen title="Статус">
                    <BadgeFilter
                        properties={RELEASE_STATUS}
                        selected={statuses}
                        property="statuses"
                        onParamChange={handleChangeParam}
                    />
                </CollapsibleFilter>
                <CollapsibleFilter defaultOpen title="Сезон">
                    <BadgeFilter
                        properties={SEASON}
                        selected={seasons}
                        property="seasons"
                        onParamChange={handleChangeParam}
                    />
                </CollapsibleFilter>
                <CollapsibleFilter defaultOpen title="Жанри">
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
                </CollapsibleFilter>
                <CollapsibleFilter title="Тип">
                    <BadgeFilter
                        properties={ANIME_MEDIA_TYPE}
                        selected={types}
                        property="types"
                        onParamChange={handleChangeParam}
                    />
                </CollapsibleFilter>
                <CollapsibleFilter title="Локалізація">
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
                </CollapsibleFilter>
                <CollapsibleFilter title="Сортування">
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
                </CollapsibleFilter>

                <CollapsibleFilter title="Рейтинг">
                    <BadgeFilter
                        properties={AGE_RATING}
                        selected={ageRatings}
                        property="ratings"
                        onParamChange={handleChangeParam}
                    />
                </CollapsibleFilter>
                <CollapsibleFilter title="Студія">
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
                </CollapsibleFilter>
                <CollapsibleFilter title="Рік виходу">
                    <div className="flex items-center gap-2">
                        <YearFilterInput
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
                        <YearFilterInput
                            years={selectingYears}
                            setSelectingYears={setSelectingYears}
                            range={RANGE.MAX}
                            handleChangeParam={handleChangeParam}
                        />
                    </div>
                </CollapsibleFilter>
            </div>
            <Button
                variant="secondary"
                className="mt-4 w-full shadow-md lg:flex"
                onClick={clearFilters}
                asChild
            >
                <Link href="/anime">
                    <AntDesignClearOutlined /> Очистити
                </Link>
            </Button>
        </ScrollArea>
    );
};

export default AnimeFilters;
