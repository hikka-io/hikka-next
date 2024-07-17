'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const ScrollTop = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (window) window.scroll(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollTop;
