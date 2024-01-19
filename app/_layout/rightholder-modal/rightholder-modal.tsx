'use client';

import * as React from 'react';

import Modal from '@/app/_components/modal';
import { useModalContext } from '@/utils/providers/modal-provider';

import Content from './content.mdx';

const Component = () => {
    const { rightholder, closeModals } = useModalContext();

    const onDismiss = () => {
        closeModals();
    };

    return (
        <Modal
            open={Boolean(rightholder)}
            onDismiss={onDismiss}
            id="searchModal"
            boxClassName="p-0 flex flex-col relative"
            title="Правовласникам"
        >
            <div className="markdown flex-1 p-8">
                <Content />
            </div>
        </Modal>
    );
};

export default Component;
