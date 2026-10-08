import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { API_LIMITS, searchUsersOptions } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { SYMBOL_FORMS } from '@/utils/i18n/word-forms';

import { insertMentionLink } from '../editor/transforms';
import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';

const TOO_SHORT_MESSAGE = `Введіть щонайменше ${API_LIMITS.userSearchQuery.min} ${getDeclensionWord(API_LIMITS.userSearchQuery.min, SYMBOL_FORMS)}`;

export function UserSearchInputElement(props: PlateElementProps) {
    const { children, editor, element } = props;
    const [search, setSearch] = React.useState('');
    const [debouncedSearch] = useDebounce({
        value: search,
        delay: DEBOUNCE_MS.input,
    });

    const isTooShort =
        debouncedSearch.trim().length < API_LIMITS.userSearchQuery.min;
    const isPending = search !== debouncedSearch;

    const { data: users, isFetching } = useQuery({
        ...searchUsersOptions({ body: { query: debouncedSearch } }),
        enabled: !isTooShort,
    });

    const mentionable = users?.filter((user) => user.username);

    return (
        <PlateElement as="span" {...props}>
            <InlineCombobox
                value={search}
                element={element}
                filter={false}
                setValue={setSearch}
                trigger="@"
                hideWhenNoValue
            >
                <InlineComboboxInput />

                <InlineComboboxContent>
                    <InlineComboboxEmpty>
                        {isTooShort
                            ? TOO_SHORT_MESSAGE
                            : isFetching || isPending
                              ? 'Завантаження...'
                              : 'Користувачів не знайдено'}
                    </InlineComboboxEmpty>

                    <InlineComboboxGroup>
                        {mentionable?.map((user) => (
                            <InlineComboboxItem
                                key={user.reference}
                                value={user.username ?? ''}
                                onClick={() => insertMentionLink(editor, user)}
                            >
                                <Avatar className="size-5">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                        {user.username?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {user.username}
                            </InlineComboboxItem>
                        ))}
                    </InlineComboboxGroup>
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    );
}
