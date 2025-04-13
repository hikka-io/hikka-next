'use client';

import { FC } from 'react';

import useEdit from '@/services/hooks/edit/use-edit';
import { EDIT_STATUS } from '@/utils/constants/edit';
import { Badge } from '../../components/ui/badge';

interface Props {
    editId: string;
}

const EditStatus: FC<Props> = ({ editId }) => {
    const { data: edit } = useEdit({ edit_id: Number(editId) });

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
