'use client';

import { useGenres } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import {
    Select,
    SelectContent,
    SelectEmpty,
    SelectList,
    SelectSearch,
    SelectTrigger,
    SelectValue,
    groupOptions,
    renderSelectOptions,
} from '@/components/ui/select';

import { GENRE_TYPES } from '@/utils/constants/common';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const Genre: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const genres = searchParams.getAll('genres');

    const handleChangeParam = useChangeParam();
    const { data: genreList } = useGenres({
        options: {
            select: (data) => {
                return groupOptions(
                    data.list.map((genre) => ({
                        value: genre.slug,
                        label: genre.name_ua,
                        group: GENRE_TYPES[genre.type].title_ua,
                    })),
                );
            },
        },
    });

    return (
        <CollapsibleFilter defaultOpen title="Жанри" active={genres.length > 0}>
            <Select
                triState={true}
                multiple
                value={genres}
                onValueChange={(value) => handleChangeParam('genres', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Виберіть жанр/жанри..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectSearch placeholder="Назва жанру..." />
                    <SelectList>
                        {genreList && renderSelectOptions(genreList)}
                        <SelectEmpty>Жанрів не знайдено</SelectEmpty>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default Genre;
