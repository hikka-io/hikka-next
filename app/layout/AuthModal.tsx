'use client';

import Modal from '@/app/components/Modal';

const Component = () => {
    return <Modal id="authModal" onDismiss={() => window.authModal.close()}></Modal>;
};

export default Component;
