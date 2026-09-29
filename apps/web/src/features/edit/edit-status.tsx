import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getEditOptions } from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import { EDIT_STATUS } from '@/utils/constants/common';

import { EDIT_STATUS_STYLE } from './edit-status-style';

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

    return (
        <Badge variant={EDIT_STATUS_STYLE[edit.status].variant}>
            {EDIT_STATUS[edit.status].title_ua}
        </Badge>
    );
};

export default EditStatusBadge;
