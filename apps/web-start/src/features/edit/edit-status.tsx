import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import { EDIT_STATUS } from '@/utils/constants/edit';

type Props = {
    editId: string;
};

const EditStatusBadge: FC<Props> = ({ editId }) => {
    const { data: edit } = useQuery(
        getEditOptions({ path: { edit_id: Number(editId) } }),
    );

    if (!edit?.status) {
        return null;
    }

    const variant =
        edit.status === 'pending'
            ? 'warning'
            : edit.status === 'accepted'
              ? 'success'
              : edit.status === 'denied'
                ? 'destructive'
                : 'secondary';

    return <Badge variant={variant}>{EDIT_STATUS[edit.status].title_ua}</Badge>;
};

export default EditStatusBadge;
