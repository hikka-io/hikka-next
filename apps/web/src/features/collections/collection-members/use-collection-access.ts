import { useQuery } from '@tanstack/react-query';

import {
    CollectionMemberRoleEnum,
    CollectionVisibilityEnum,
    getCollectionOptions,
} from '@hikka/api';

export const useCollectionAccess = (
    reference: string,
    options?: { enabled?: boolean },
) => {
    const { data: collection } = useQuery({
        ...getCollectionOptions({ path: { reference } }),
        enabled: options?.enabled ?? true,
    });

    const myRole = collection?.my_role ?? null;

    return {
        collection,
        myRole,
        isOwner: myRole === CollectionMemberRoleEnum.OWNER,
        isEditor: myRole === CollectionMemberRoleEnum.EDITOR,
        isPrivate: collection?.visibility === CollectionVisibilityEnum.PRIVATE,
    };
};
