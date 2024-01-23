'use client';

import * as React from 'react';
import { Dispatch, ReactNode, SetStateAction } from 'react';

import Modal from '@/app/_components/modal';

interface Props {
    className?: string;
    data: ReactNode;
    title: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Component = ({ data, title, open, setOpen, className }: Props) => {
    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            id='mardownModal'
            title={title}
            boxClassName={className}
        >
            <div className='markdown overflow-hidden'>{data}</div>
        </Modal>
    );
};

export default Component;