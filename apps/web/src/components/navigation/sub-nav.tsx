'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useMediaQuery } from '../../services/hooks/use-media-query';

interface Props extends PropsWithChildren {}

const Component = ({ children }: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isMounted && !isDesktop) {
        return createPortal(
            <>{children}</>,
            document.getElementById('subbar-mobile')!,
        );
    }

    return null;
};

export default Component;
