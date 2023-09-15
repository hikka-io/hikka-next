'use client';

import Slider from '@/app/components/Slider';
import Select from '@/app/components/Select';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const types: Hikka.Filter<Hikka.Release>[] = [
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

const statuses: Hikka.Filter<Hikka.Status>[] = [
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

const seasons: Hikka.Filter<Hikka.Season>[] = [
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

const ageRatings: Hikka.Filter<Hikka.AgeRating>[] = [
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

const Component = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(searchParams.getAll('statuses'));
    const [selectedTypes, setSelectedTypes] = useState<string[]>(searchParams.getAll('types'));
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>(searchParams.getAll('seasons'));
    const [selectedAgeRatings, setSelectedAgeRatings] = useState<string[]>(searchParams.getAll('ratings'));

    const createQueryString = useCallback(
        (name: string, value: string | string[]) => {
            const params = new URLSearchParams(searchParams);

            if (value) {
                if (Array.isArray(value)) {
                    params.delete(name);
                    value.forEach((v) => params.append(name, String(v)));
                } else {
                    params.set(name, value);
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

    return (
        <div className="flex justify-center">
            <div>
                <div>
                    <label className="label">
                        <span className="label-text text-secondary">Жанр</span>
                    </label>
                    <Select defaultValue={1}>
                        <Select.Option value={2}>Action</Select.Option>
                        <Select.Option value={3}>Hentai</Select.Option>
                    </Select>
                </div>
                <div className="form-control mt-9">
                    <label className="label cursor-pointer">
                        <input type="checkbox" className="checkbox" />
                        <span className="label-text ">
                            Перекладено українською
                        </span>
                    </label>
                </div>
                <div className="mt-9">
                    <label className="label">
                        <span className="label-text text-secondary">
                            Статус
                        </span>
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
                <div className="mt-9">
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
                <div className="mt-9">
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
                <div className="mt-9">
                    <label className="label">
                        <span className="label-text text-secondary">
                            Рейтинг
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {ageRatings.map((ageRating) => (
                            <button
                                onClick={() =>
                                    setSelectedAgeRatings((prev) =>
                                        handleFilterSelect(
                                            ageRating.slug,
                                            prev,
                                        ),
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
                    <div className="mt-9">
                        <Slider
                            min={1980}
                            max={2023}
                            label="Рік"
                            defaultValue={[1999, 2023]}
                            marks="years"
                        />
                    </div>
                    <div className="mt-9">
                        {/*<Slider
                            min={1}
                            max={10}
                            label="Оцінка"
                            defaultValue={[5, 10]}
                            marks={true}
                        />*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
