'use client';

import * as React from 'react';

import P from '@/components/typography/p';
import useEdit from '@/services/hooks/edit/useEdit';
import { EDIT_STATUS } from '@/utils/constants';

interface Props {
    editId: string;
}

const EditStatus = ({ editId }: Props) => {
    const { data: edit } = useEdit({ editId: Number(editId) });

    if (!edit || !edit.status) {
        return null;
    }

    return (
        <div
            className="whitespace-nowrap rounded-sm px-2"
            style={{
                backgroundColor: EDIT_STATUS[edit.status].color,
            }}
        >
            <P className="text-sm text-white">
                {EDIT_STATUS[edit.status].title_ua}
            </P>
        </div>
    );
};

export default EditStatus;
