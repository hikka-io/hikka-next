import { useQuery } from '@tanstack/react-query';

import {
    CollectionMemberRoleEnum,
    CollectionMemberStatusEnum,
    getCollectionMembersOptions,
} from '@hikka/api';

import { useSession } from '@/features/auth/hooks/use-session';
import { COLLECTION_MEMBERS_LIMIT } from '@/utils/constants/collection-options';

const MEMBERS_PAGE_SIZE = COLLECTION_MEMBERS_LIMIT * 2;

export const useCollectionMembers = (
    reference: string,
    options?: { enabled?: boolean },
) => {
    const { user } = useSession();

    const query = useQuery({
        ...getCollectionMembersOptions({
            path: { reference },
            query: { size: MEMBERS_PAGE_SIZE },
        }),
        enabled: options?.enabled ?? true,
    });

    const list = query.data?.list ?? [];

    return {
        ...query,
        list,
        accepted: list.filter(
            (member) => member.status === CollectionMemberStatusEnum.ACCEPTED,
        ),
        // The API only returns pending rows to the owner and the invitee
        pending: list.filter(
            (member) => member.status === CollectionMemberStatusEnum.PENDING,
        ),
        owner: list.find(
            (member) => member.role === CollectionMemberRoleEnum.OWNER,
        ),
        coauthorsCount: list.filter(
            (member) => member.role !== CollectionMemberRoleEnum.OWNER,
        ).length,
        me: user
            ? list.find((member) => member.user.username === user.username)
            : undefined,
    };
};
