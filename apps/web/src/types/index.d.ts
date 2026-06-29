import { ReactNode } from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            spoiler: { children: ReactNode };
            div: { children: ReactNode };
        }
    }
}
