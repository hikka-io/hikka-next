import { createContext } from 'react';

import type { HikkaProviderValue } from './HikkaProvider';

export const HikkaContext = createContext<HikkaProviderValue | undefined>(
    undefined,
);
