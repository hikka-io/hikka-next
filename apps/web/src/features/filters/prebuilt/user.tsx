'use client';

import { useSearchUsers } from '@hikka/react';
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

import CollapsibleFilter from '../collapsible-filter';
import useChangeParam from '../use-change-param';

interface Props {
    className?: string;
    paramKey: string;
    title: string;
}

const User: FC<Props> = ({ className, paramKey, title }) => {
    const searchParams = useSearchParams()!;
    const [userSearch, setUserSearch] = useState<string>();
    const { data: users, isFetching: isUsersFetching } = useSearchUsers({
        args: {
            query: userSearch || '',
        },
        options: {
            enabled: !!userSearch,
        },
    });

    const user = searchParams.get(paramKey);

    const handleChangeParam = useChangeParam();

    const handleUserSearch = (keyword: string) => {
        if (keyword.length < 3) {
            setUserSearch(undefined);
            return;
        }

        setUserSearch(keyword);
    };

    return (
        <CollapsibleFilter title={title} active={user !== null}>
            <Select
                value={user !== null ? [user] : []}
                onValueChange={(value) => handleChangeParam(paramKey, value[0])}
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

export default User;
