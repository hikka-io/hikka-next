import { HikkaClient } from '@hikka/client';
import { createContext } from 'react';

export interface HikkaContextValue {
    client: HikkaClient;
}

export const HikkaContext = createContext<HikkaContextValue | undefined>(
    undefined,
);
