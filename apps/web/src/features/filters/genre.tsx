import { type FC, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Drama } from 'lucide-react';

import { type GenreTypeEnum, genresOptions } from '@hikka/api';

import {
    SelectField,
    type SelectFieldProps,
    useTypedAppFormContext,
} from '@/components/form';
import { Label } from '@/components/ui/label';
import {
    groupOptions,
    renderSelectOptions,
    Select,
    SelectContent,
    SelectEmpty,
    SelectList,
    SelectSearch,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { GENRE_TYPES } from '@/utils/constants/common';
import { useRouteSearch } from '@/utils/navigation';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    className?: string;
};

const Genre: FC<Props> = () => {
    const { genres = [] } = useRouteSearch<{ genres?: string[] }>();

    const handleChangeParam = useChangeParam();
    const { data: genreList } = useQuery({
        ...genresOptions(),
        select: (data) =>
            data.list.map((genre) => ({
                value: genre.slug,
                label: genre.name_ua,
                group: GENRE_TYPES[genre.type as GenreTypeEnum].title_ua,
            })),
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
};

export const FormGenre: FC<Props & Partial<SelectFieldProps>> = (props) => {
    const { data: genreList } = useQuery({
        ...genresOptions(),
        select: (data) =>
            data.list.map((genre) => ({
                value: genre.slug,
                label: genre.name_ua,
                group: GENRE_TYPES[genre.type as GenreTypeEnum].title_ua,
            })),
    });

    const options = useMemo(() => {
        return genreList && renderSelectOptions(groupOptions(genreList));
    }, [genreList]);

    const form = useTypedAppFormContext(filterPresetFormOptions);
    return (
        <form.AppField
            name="genres"
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
