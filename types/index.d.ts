import { ReactNode } from 'react';

import '@tanstack/react-query';

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
        }
    }
}
