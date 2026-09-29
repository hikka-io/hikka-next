import type { ReactNode } from 'react';

export type ListStat = {
    percentage: number;
    value: number;
    icon?: ReactNode;
    color?: string;
    name?: string;
};
