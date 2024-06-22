'use client';

import { useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';

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
} from '@/components/ui/select';

import useUsers from '@/services/hooks/user/use-users';

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
}

const EditAuthor: FC<Props> = ({ className }) => {
    const searchParams = useSearchParams()!;
    const [userSearch, setUserSearch] = useState<string>();
    const { data: users, isFetching: isUsersFetching } = useUsers({
        query: userSearch,
    });

    const author = searchParams.get('author');

    const handleChangeParam = useChangeParam();

    const handleUserSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setUserSearch(undefined);
            return;
        }

        setUserSearch(keyword);
    };

    return (
        <CollapsibleFilter title="Автор">
            <Select
                value={author !== null ? [author] : []}
                onValueChange={(value) => handleChangeParam('author', value[0])}
                onOpenChange={() => setUserSearch(undefined)}
                onSearch={handleUserSearch}
            >
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Виберіть користувача..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectSearch placeholder="Імʼя користувача..." />
                    <SelectList>
                        <SelectGroup>
                            {!isUsersFetching &&
                                users?.map((item) => (
                                    <SelectItem
                                        key={item.username}
                                        value={item.username}
                                    >
                                        {item.username}
                                    </SelectItem>
                                ))}
                            <SelectEmpty>
                                {isUsersFetching
                                    ? 'Завантаження...'
                                    : 'Користувачів не знайдено'}
                            </SelectEmpty>
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </CollapsibleFilter>
    );
};

export default EditAuthor;
