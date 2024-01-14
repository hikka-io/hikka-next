'use client';
import * as React from 'react';

import { EDIT_STATUS } from '@/utils/constants';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getEdit from '@/utils/api/edit/getEdit';

const Component = () => {
    const params = useParams();

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) })
    });

    if (!edit || !edit.status) {
        return null;
    }

    return (
        <div
            className="whitespace-nowrap rounded-md px-2"
            style={{
                backgroundColor: EDIT_STATUS[edit.status].color,
            }}
        >
            <p className="label-text font-normal !text-white">
                {EDIT_STATUS[edit.status].title_ua}
            </p>
        </div>
    );
};

export default Component;
