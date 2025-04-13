'use client';

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
    renderSelectOptions,
} from '../../../components/ui/select';
import useGenres from '../../../services/hooks/genres/use-genres';
import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const Genre: FC<Props> = () => {
    const searchParams = useSearchParams()!;

    const genres = searchParams.getAll('genres');

    const handleChangeParam = useChangeParam();
    const { data: genresList } = useGenres();

    return (
        <CollapsibleFilter defaultOpen title="Жанри" active={genres.length > 0}>
            <Select
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
                        {genresList && renderSelectOptions(genresList)}
                        <SelectEmpty>Жанрів не знайдено</SelectEmpty>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default Genre;
