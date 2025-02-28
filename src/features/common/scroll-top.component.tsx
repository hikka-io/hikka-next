'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ScrollTop = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (
            window &&
            searchParams.toString().length === 0 &&
            window.location.hash.length === 0
        )
            window.scroll(0, 0);
    }, [pathname, searchParams]);

    return null;
};

export default ScrollTop;
