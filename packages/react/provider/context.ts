import { HikkaClient } from '@hikka/client';
import { createContext } from 'react';

export const HikkaContext = createContext<HikkaClient | undefined>(undefined);
