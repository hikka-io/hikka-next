'use client';

import Slider from '@/app/components/Slider';
import Select from '@/app/components/Select';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import getAnimeGenres from '@/utils/api/anime/getAnimeGenres';
import AiClearOutlined from '@/app/components/icons/AiClearOutlined';
import AiCloseOutlined from '@/app/components/icons/AiCloseOutlined';

type Filter<T> = {
    title: string;
    slug: T;
};

const types: Filter<Hikka.Release>[] = [
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

const statuses: Filter<Hikka.Status>[] = [
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

const seasons: Filter<Hikka.Season>[] = [
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

const ageRatings: Filter<Hikka.AgeRating>[] = [
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

const years: [number, number] = [1980, new Date().getFullYear()];

const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const { data: genres } = useQuery({
        queryKey: ['animeGenres'],
        queryFn: () => getAnimeGenres(),
    });

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
        searchParams.getAll('statuses'),
    );
    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        searchParams.getAll('types'),
    );
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>(
        searchParams.getAll('seasons'),
    );
    const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>(
        searchParams.getAll('ratings'),
    );
    const [selectedYears, setSelectedYears] = useState<string[]>(
        searchParams.getAll('years'),
    );
    const [selectedGenres, setSelectedGenres] = useState<string[]>(
        searchParams.getAll('genres'),
    );
    const [selectingYears, setSelectingYears] = useState<string[]>(
        searchParams.getAll('years').length > 0
            ? searchParams.getAll('years')
            : years.map((y) => String(y)),
    );
    const [selectedUA, setSelectedUA] = useState<boolean>(
        Boolean(searchParams.get('lang')),
    );

    const createQueryString = useCallback(
        (name: string, value: string | string[] | boolean) => {
            const params = new URLSearchParams(searchParams);

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
        router.push(`${pathname}`);

        setTimeout(() => {
            setSelectedGenres([]);
            setSelectedYears([]);
            setSelectedAgeRatings([]);
            setSelectedSeasons([]);
            setSelectedTypes([]);
            setSelectedStatuses([]);
            setSelectedUA(false);
        }, 200)
    };

    useEffect(() => {
        const query = createQueryString('seasons', selectedSeasons);

        router.replace(`${pathname}?${query}`);
    }, [selectedSeasons]);

    useEffect(() => {
        const query = createQueryString('ratings', selectedAgeRatings);

        router.replace(`${pathname}?${query}`);
    }, [selectedAgeRatings]);

    useEffect(() => {
        const query = createQueryString('types', selectedTypes);

        router.replace(`${pathname}?${query}`);
    }, [selectedTypes]);

    useEffect(() => {
        const query = createQueryString('statuses', selectedStatuses);

        router.replace(`${pathname}?${query}`);
    }, [selectedStatuses]);

    useEffect(() => {
        const query = createQueryString('years', selectedYears);

        router.replace(`${pathname}?${query}`);
    }, [selectedYears]);

    useEffect(() => {
        const query = createQueryString('lang', selectedUA ? 'ua' : '');

        router.replace(`${pathname}?${query}`);
    }, [selectedUA]);

    useEffect(() => {
        const query = createQueryString('genres', selectedGenres);

        router.replace(`${pathname}?${query}`);
    }, [selectedGenres]);

    return (
        <div className="flex flex-col items-start gap-8 w-full">
            <div className="w-full">
                <label className="label">
                    <span className="label-text text-secondary">Жанр</span>
                </label>
                {genres?.length && genres.length > 0 && (
                    <Select
                        placeholder="Виберіть жанр/жанри"
                        multiple
                        value={selectedGenres}
                        onChange={(e, value) =>
                            setSelectedGenres(value as string[])
                        }
                    >
                        {genres?.map((genre) => (
                            <Select.Option key={genre.slug} value={genre.slug}>
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
                        checked={selectedUA}
                        onChange={() => setSelectedUA((prev) => !prev)}
                    />
                    <span className="label-text ">Перекладено українською</span>
                </label>
            </div>
            <div className="w-full">
                <label className="label">
                    <span className="label-text text-secondary">Статус</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                    {statuses.map((status) => (
                        <button
                            onClick={() =>
                                setSelectedStatuses((prev) =>
                                    handleFilterSelect(status.slug, prev),
                                )
                            }
                            key={status.slug}
                            className={clsx(
                                'btn-sm btn rounded-3xl px-3.5 py-1',
                                selectedStatuses.includes(status.slug)
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
                    {types.map((type) => (
                        <button
                            onClick={() =>
                                setSelectedTypes((prev) =>
                                    handleFilterSelect(type.slug, prev),
                                )
                            }
                            key={type.slug}
                            className={clsx(
                                'btn-sm btn rounded-3xl px-3.5 py-1',
                                selectedTypes.includes(type.slug)
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
                    {seasons.map((season) => (
                        <button
                            onClick={() =>
                                setSelectedSeasons((prev) =>
                                    handleFilterSelect(season.slug, prev),
                                )
                            }
                            key={season.slug}
                            className={clsx(
                                'btn-sm btn rounded-3xl px-3.5 py-1',
                                selectedSeasons.includes(season.slug)
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
                    <span className="label-text text-secondary">Рейтинг</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {ageRatings.map((ageRating) => (
                        <button
                            onClick={() =>
                                setSelectedAgeRatings((prev) =>
                                    handleFilterSelect(ageRating.slug, prev),
                                )
                            }
                            key={ageRating.slug}
                            className={clsx(
                                'btn-sm btn rounded-3xl px-3.5 py-1',
                                selectedAgeRatings.includes(ageRating.slug)
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
                        onChangeCommitted={(e, value) =>
                            setSelectedYears((value as number[]).map(String))
                        }
                        onChange={(e, value) =>
                            setSelectingYears((value as number[]).map(String))
                        }
                        min={years[0]}
                        max={years[1]}
                        marks={Array.from(
                            Array(Math.floor((years[1] - years[0]) / 5)).keys(),
                        ).map((v, i) => ({
                            value: years[0] + (i + 1) * 5,
                        }))}
                        value={selectingYears.map((y) => Number(y))}
                    />
                    <p className="badge">{selectingYears[1]}</p>
                </div>
            </div>
            <div className="w-full flex gap-2">
                <button
                    onClick={clearFilters}
                    className="btn btn-outline flex-1 btn-error"
                >
                    <AiClearOutlined />
                    Clear Filters
                </button>
                <label
                    htmlFor="filterDrawer"
                    className="btn drawer-button btn-square btn-outline flex md:hidden"
                >
                    <AiCloseOutlined />
                </label>
            </div>
        </div>
    );
};

export default Component;
