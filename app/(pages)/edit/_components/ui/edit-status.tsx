'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import P from '@/components/typography/p';
import useEdit from '@/services/hooks/edit/useEdit';
import { EDIT_STATUS } from '@/utils/constants';

interface Props {
    status?: API.EditStatus;
}

const Component = ({ status }: Props) => {
    const params = useParams();
    const { data: edit } = useEdit({ editId: Number(params.editId) });

    if (!status && (!edit || !edit.status)) {
        return null;
    }

    const currentStatus = status ? status : edit!.status;

    return (
        <div
            className="whitespace-nowrap rounded-md px-2"
            style={{
                backgroundColor: EDIT_STATUS[currentStatus].color,
            }}
        >
            <P className="text-sm">{EDIT_STATUS[currentStatus].title_ua}</P>
        </div>
    );
};

export default Component;
