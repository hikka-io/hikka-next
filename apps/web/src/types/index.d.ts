import '@tanstack/react-query';
import { ReactNode } from 'react';

interface QueryMeta extends Record<string, unknown> {
    auth: string | undefined;
}

declare module '@tanstack/react-query' {
    interface Register {
        queryMeta: QueryMeta;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            spoiler: { children: ReactNode };
            div: { children: ReactNode };
        }
    }
}
