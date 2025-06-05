'use client';

import { createContext } from 'react';

import { HikkaProviderValue } from './HikkaProvider';

export const HikkaContext = createContext<HikkaProviderValue | undefined>(
    undefined,
);
