'use client';

import { useEdit } from '@hikka/react';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

import { EDIT_STATUS } from '@/utils/constants/edit';

interface Props {
    editId: string;
}

const EditStatus: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ editId: Number(editId) });

    if (!edit || !edit.status) {
        return null;
    }

    return (
        <Badge variant="status" bgColor={EDIT_STATUS[edit.status].color}>
            {EDIT_STATUS[edit.status].title_ua}
        </Badge>
    );
};

export default EditStatus;
