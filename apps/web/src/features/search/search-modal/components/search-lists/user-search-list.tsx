import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { searchUsersOptions, type UserResponse } from '@hikka/api';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import type { SearchEntity } from '../../search-entities';
import type { SearchResultVariant } from '../../types';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

type Props = {
    entity: SearchEntity;
    onDismiss: (user: UserResponse) => void;
    type?: SearchResultVariant;
    value?: string;
};

const UserSearchList = ({ entity, onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (user: UserResponse) => {
            onDismiss(user);

            const href = entity.getHref(user);
            if (type !== 'button' && href) {
                router.push(href);
            }
        },
        [onDismiss, router, type, entity],
    );
    const { data, isFetching, isRefetching } = useQuery({
        ...searchUsersOptions({ body: { query: value || '' } }),
        enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
    });

    return (
        <SearchList>
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.length > 0 && (
                <SearchGroup>
                    {data.map((user) => {
                        const href = entity.getHref(user);
                        // A user without a username has nowhere to link to.
                        if (!href) return null;

                        // The row still keys on the reference rather than the
                        // href: it is the stable id the API guarantees.
                        return (
                            <SearchItem
                                key={user.reference}
                                value={user.reference}
                                onSelect={() => handleSelect(user)}
                            >
                                {entity.renderCard(user, href, type)}
                            </SearchItem>
                        );
                    })}
                </SearchGroup>
            )}
        </SearchList>
    );
};

export default UserSearchList;
