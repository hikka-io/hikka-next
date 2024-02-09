'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { useEdit } from '@/app/(pages)/edit/page.hooks';
import { EDIT_STATUS } from '@/utils/constants';

interface Props {
    status?: Hikka.EditStatus;
}

const Component = ({ status }: Props) => {
    const params = useParams();
    const { data: edit } = useEdit(String(params.editId));

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
            <p className="text-sm">{EDIT_STATUS[currentStatus].title_ua}</p>
        </div>
    );
};

export default Component;