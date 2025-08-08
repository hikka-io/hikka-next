'use client';

import { useGenres } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC, useMemo } from 'react';

import FormSelect, { FormSelectProps } from '@/components/form/form-select';
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
                return data.list.map((genre) => ({
                    value: genre.slug,
                    label: genre.name_ua,
                    group: GENRE_TYPES[genre.type].title_ua,
                }));
            },
        },
    });

    const options = useMemo(() => {
        return genreList && renderSelectOptions(groupOptions(genreList));
    }, [genreList]);

    return (
        <CollapsibleFilter defaultOpen title="Жанри" active={genres.length > 0}>
            <Select
                options={genreList}
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
                        {options}
                        <SelectEmpty>Жанрів не знайдено</SelectEmpty>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export const FormGenre: FC<Props & Partial<FormSelectProps>> = (props) => {
    const { data: genreList } = useGenres({
        options: {
            select: (data) => {
                return data.list.map((genre) => ({
                    value: genre.slug,
                    label: genre.name_ua,
                    group: GENRE_TYPES[genre.type].title_ua,
                }));
            },
        },
    });

    const options = useMemo(() => {
        return genreList && renderSelectOptions(groupOptions(genreList));
    }, [genreList]);

    return (
        <FormSelect
            {...props}
            name="genres"
            label="Жанри"
            multiple
            triState
            placeholder="Виберіть жанр/жанри..."
            options={genreList}
        >
            <SelectContent>
                <SelectSearch placeholder="Назва жанру..." />
                <SelectList>
                    {options}
                    <SelectEmpty>Жанрів не знайдено</SelectEmpty>
                </SelectList>
            </SelectContent>
        </FormSelect>
    );
};

export default Genre;
