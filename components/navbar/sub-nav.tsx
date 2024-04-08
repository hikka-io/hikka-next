'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import useIsMobile from '@/services/hooks/useIsMobile';

interface Props extends PropsWithChildren {}

const Component = ({ children }: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isMounted && isMobile) {
        return createPortal(
            <>{children}</>,
            document.getElementById('subbar-mobile')!,
        );
    }

    return null;
};

export default Component;
