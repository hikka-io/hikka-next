'use client';

import { useGenres } from '@hikka/react';
import { Drama } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC, useMemo } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormSelect, { FormSelectProps } from '@/components/form/form-select';
import { Label } from '@/components/ui/label';
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

import { useChangeParam } from '@/features/filters';

import { GENRE_TYPES } from '@/utils/constants/common';

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
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Drama className="size-4 shrink-0" />
                <Label>Жанри</Label>
            </div>
            <Select
                options={genreList}
                triState={true}
                multiple
                value={genres}
                onValueChange={(value) => handleChangeParam('genres', value)}
            >
                <SelectTrigger size="md">
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
        </div>
    );

    return (
        <CollapsibleFilter
            defaultOpen
            title="Жанри"
            icon={<Drama className="size-4" />}
            active={genres.length > 0}
        >
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
