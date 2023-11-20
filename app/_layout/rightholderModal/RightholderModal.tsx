'use client';

import Modal from '@/app/_components/Modal';
import { useModalContext } from '@/utils/providers/ModalProvider';
import * as React from 'react';
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
            <div className="flex-1 p-8 markdown">
                <Content />
            </div>
        </Modal>
    );
};

export default Component;
