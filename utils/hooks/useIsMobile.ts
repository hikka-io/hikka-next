'use client';
import { useEffect, useState } from 'react';

const getIsMobile = () => typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;

export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState(getIsMobile());

    useEffect(() => {
        const onResize = () => {
            setIsMobile(getIsMobile());
        };

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return isMobile;
}
