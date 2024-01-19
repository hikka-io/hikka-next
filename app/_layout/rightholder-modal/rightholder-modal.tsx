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
            onOpenChange={(open) => !open && onDismiss()}
            id="searchModal"
            title="Правовласникам"
        >
            <div className="markdown">
                <Content />
            </div>
        </Modal>
    );
};

export default Component;
