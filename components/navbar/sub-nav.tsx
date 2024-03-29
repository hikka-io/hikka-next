'use client';

import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import useIsMobile from '@/services/hooks/useIsMobile';

interface Props extends PropsWithChildren {
    mobileOnly?: boolean;
}

const Component = ({ children, mobileOnly }: Props) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return createPortal(
            <>{children}</>,
            document.getElementById('subbar-mobile')!,
        );
    }

    if (mobileOnly) {
        return null;
    }

    return createPortal(
        <div className="overflow-hidden rounded-full px-4 shadow-lg">
            {children}
        </div>,
        document.getElementById('subbar')!,
    );
};

export default Component;
