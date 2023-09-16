'use client';

import Slider from '@/app/components/Slider';
import Select from '@/app/components/Select';
import {useCallback, useEffect, useRef, useState} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import getAnimeGenres from '@/utils/api/anime/getAnimeGenres';
import AiClearOutlined from '@/app/components/icons/AiClearOutlined';
import AiCloseOutlined from '@/app/components/icons/AiCloseOutlined';
import useScrollTrigger from "@/utils/hooks/useScrollTrigger";
import useIsMobile from "@/utils/hooks/useIsMobile";

type Filter<T> = {
    title: string;
    slug: T;
};

const TYPES: Filter<Hikka.Release>[] = [
    {
        title: 'Серіал',
        slug: 'tv',
    },
    {
        title: 'Фільм',
        slug: 'movie',
    },
    {
        title: 'OVA',
        slug: 'ova',
    },
    {
        title: 'ONA',
        slug: 'ona',
    },
    {
        title: 'Спешл',
        slug: 'special',
    },
    {
        title: 'Кліп',
        slug: 'music',
    },
];

const STATUSES: Filter<Hikka.Status>[] = [
    {
        title: 'Онґоінґ',
        slug: 'airing',
    },
    {
        title: 'Анонс',
        slug: 'not_yet',
    },
    {
        title: 'Реліз',
        slug: 'finished',
    },
];

const SEASONS: Filter<Hikka.Season>[] = [
    {
        title: 'Осінь',
        slug: 'fall',
    },
    {
        title: 'Зима',
        slug: 'winter',
    },
    {
        title: 'Весна',
        slug: 'spring',
    },
    {
        title: 'Літо',
        slug: 'summer',
    },
];

const AGE_RATINGS: Filter<Hikka.AgeRating>[] = [
    {
        title: 'G',
        slug: 'g',
    },
    {
        title: 'PG',
        slug: 'pg',
    },
    {
        title: 'PG-13',
        slug: 'pg_13',
    },
    {
        title: 'R',
        slug: 'r',
    },
    {
        title: 'R PLUS',
        slug: 'r_plus',
    },
    {
        title: 'RX',
        slug: 'rx',
    },
];

const YEARS: [number, number] = [1980, new Date().getFullYear()];

const Component = () => {
    const filterRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('lang');

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
            setSelectingYears(years.length > 0 ? years : YEARS.map((y) => String(y)));
        }
    }, [searchParams]);

    return (
        <div
            className={clsx(
                'flex flex-col items-start gap-8',
                'md:absolute md:top-0',
                'border-t border-t-transparent',
                'transition',
            )}
        >
            <div className="flex flex-col items-start gap-8 w-full overflow-y-scroll md:overflow-y-visible" ref={filterRef}>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-secondary">Жанр</span>
                    </label>
                    {genresList?.length && genresList.length > 0 && (
                        <Select
                            placeholder="Виберіть жанр/жанри"
                            multiple
                            value={genres}
                            onChange={(_e, value) =>
                                handleChangeParam('genres', value as string[])
                            }
                        >
                            {genresList?.map((genre) => (
                                <Select.Option
                                    key={genre.slug}
                                    value={genre.slug}
                                >
                                    {genre.name_en}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </div>
                <div className="form-control w-full">
                    <label className="label cursor-pointer justify-start gap-4">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={Boolean(lang)}
                            onChange={() =>
                                handleChangeParam('lang', !Boolean(lang))
                            }
                        />
                        <span className="label-text ">
                            Перекладено українською
                        </span>
                    </label>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-secondary">
                            Статус
                        </span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {STATUSES.map((status) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'statuses',
                                        handleFilterSelect(
                                            status.slug,
                                            statuses,
                                        ),
                                    )
                                }
                                key={status.slug}
                                className={clsx(
                                    'btn-sm btn rounded-3xl px-3.5 py-1',
                                    statuses.includes(status.slug)
                                        ? 'btn-primary'
                                        : 'btn-outline',
                                )}
                            >
                                {status.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-secondary">Тип</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {TYPES.map((type) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'types',
                                        handleFilterSelect(type.slug, types),
                                    )
                                }
                                key={type.slug}
                                className={clsx(
                                    'btn-sm btn rounded-3xl px-3.5 py-1',
                                    types.includes(type.slug)
                                        ? 'btn-primary'
                                        : 'btn-outline',
                                )}
                            >
                                {type.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-secondary">Сезон</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {SEASONS.map((season) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'seasons',
                                        handleFilterSelect(
                                            season.slug,
                                            seasons,
                                        ),
                                    )
                                }
                                key={season.slug}
                                className={clsx(
                                    'btn-sm btn rounded-3xl px-3.5 py-1',
                                    seasons.includes(season.slug)
                                        ? 'btn-primary'
                                        : 'btn-outline',
                                )}
                            >
                                {season.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-secondary">
                            Рейтинг
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {AGE_RATINGS.map((ageRating) => (
                            <button
                                onClick={() =>
                                    handleChangeParam(
                                        'ratings',
                                        handleFilterSelect(
                                            ageRating.slug,
                                            ageRatings,
                                        ),
                                    )
                                }
                                key={ageRating.slug}
                                className={clsx(
                                    'btn-sm btn rounded-3xl px-3.5 py-1',
                                    ageRatings.includes(ageRating.slug)
                                        ? 'btn-primary'
                                        : 'btn-outline',
                                )}
                            >
                                {ageRating.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <label className="label">
                        <span className="label-text text-secondary">
                            Рік виходу
                        </span>
                    </label>
                    <div className="flex gap-4 items-center">
                        <p className="badge">{selectingYears[0]}</p>
                        <Slider
                            onChangeCommitted={(_e, value) =>
                                handleChangeParam(
                                    'years',
                                    (value as number[]).map(String),
                                )
                            }
                            onChange={(_e, value) =>
                                setSelectingYears(
                                    (value as number[]).map(String),
                                )
                            }
                            min={YEARS[0]}
                            max={YEARS[1]}
                            marks={Array.from(
                                Array(
                                    Math.floor((YEARS[1] - YEARS[0]) / 5),
                                ).keys(),
                            ).map((_v, i) => ({
                                value: YEARS[0] + (i + 1) * 5,
                            }))}
                            value={selectingYears.map((y) => Number(y))}
                        />
                        <p className="badge">{selectingYears[1]}</p>
                    </div>
                </div>
            </div>
            <div className="w-full flex gap-2 md:relative sticky bottom-4">
                <button
                    onClick={clearFilters}
                    className="btn btn-outline flex-1 btn-error bg-black"
                >
                    <AiClearOutlined />
                    Clear Filters
                </button>
                <label
                    htmlFor="filterDrawer"
                    className="btn drawer-button btn-square btn-outline flex md:hidden bg-black"
                >
                    <AiCloseOutlined />
                </label>
            </div>
        </div>
    );
};

export default Component;
