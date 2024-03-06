import { ReactNode } from 'react';

export {};

declare global {
    namespace JSX {
        // this merges with the existing intrinsic elements, adding 'my-custom-tag' and its props
        interface IntrinsicElements {
            spoiler: { children: ReactNode };
        }
    }
}
