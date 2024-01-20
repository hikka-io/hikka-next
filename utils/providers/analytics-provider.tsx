'use client';

import { ReactNode, createContext, useEffect } from 'react';

import { usePathname } from 'next/navigation';

interface ContextProps {}

const AnalyticsContext = createContext<ContextProps>({});

interface Props {
    children: ReactNode;
}

export default function AnalyticsProvider({ children }: Props) {
    const pathname = usePathname();

    useEffect(() => {
        fetch('https://hikka.io/proxy/api/event', {
            method: "POST"
        })
    }, [pathname]);

    return (
        <AnalyticsContext.Provider value={{}}>{children}</AnalyticsContext.Provider>
    );
}