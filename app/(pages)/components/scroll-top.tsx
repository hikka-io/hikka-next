'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

const ScrollTop = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (window) window.scroll(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollTop;
