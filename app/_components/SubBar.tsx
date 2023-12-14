'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import useIsMobile from '@/utils/hooks/useIsMobile';

interface Props extends PropsWithChildren {
    mobileOnly?: boolean;
}

const Component = ({ children, mobileOnly }: Props) => {
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

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
        <div className="overflow-hidden rounded-full border border-secondary bg-base-100 px-4 shadow-lg">
            {children}
        </div>,
        document.getElementById('subbar')!,
    );
};

export default Component;
