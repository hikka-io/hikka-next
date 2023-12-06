import * as React from 'react';
import { EDIT_STATUS } from '@/utils/constants';

interface Props {
    status?: Hikka.EditStatus;
}

const Component = ({ status }: Props) => {
    if (!status) {
        return null;
    }

    return (
        <div
            className="rounded-md whitespace-nowrap px-2"
            style={{
                backgroundColor: EDIT_STATUS[status].color,
            }}
        >
            <p className="label-text font-normal !text-white">
                {EDIT_STATUS[status].title_ua}
            </p>
        </div>
    );
};

export default Component;
