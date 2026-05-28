'use client';

import { useGenres } from '@hikka/react';
import { Drama } from 'lucide-react';
import { FC, useMemo } from 'react';

import { useTypedAppFormContext } from '@/components/form/use-app-form';
import { SelectFieldProps, SelectField } from '@/components/form/form-select';
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

import { GENRE_TYPES } from '@/utils/constants/common';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

interface Props {
    className?: string;
}

const Genre: FC<Props> = () => {
    const { genres = [] } = useFilterSearch<{ genres?: string[] }>();

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
            <div className="text-muted-foreground flex items-center gap-2">
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
};

export const FormGenre: FC<Props & Partial<SelectFieldProps>> = (props) => {
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

    const form = useTypedAppFormContext({ defaultValues: {} as never });
    return (
        <form.AppField
            name={"genres" as never}
            children={() => (
                <SelectField
                    {...props}
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
                </SelectField>
            )}
        />
    );
};

export default Genre;
