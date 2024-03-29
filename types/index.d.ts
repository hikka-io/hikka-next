import { ReactNode } from 'react';

export {};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            spoiler: { children: ReactNode };
        }
    }
}
