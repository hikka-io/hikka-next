'use client';

import * as React from 'react';

import { EDIT_STATUS } from '@/app/_utils/constants';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getEdit from '@/app/_utils/api/edit/getEdit';

interface Props {
    status?: Hikka.EditStatus;
}

const Component = ({ status }: Props) => {
    const params = useParams();

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) }),
        enabled: Boolean(status)
    });

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
            <p className="text-sm">
                {EDIT_STATUS[currentStatus].title_ua}
            </p>
        </div>
    );
};

export default Component;
