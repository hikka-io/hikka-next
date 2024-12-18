'use client';

import { withCn } from '@udecode/cn';

import { Toolbar } from './toolbar';

export const FixedToolbar = withCn(
    Toolbar,
    'bg-secondary/30 sticky left-0 top-16 z-[1] w-full justify-between overflow-x-auto border-b border-b-border rounded-none rounded-t-sm px-1 py-1.5 backdrop-blur scrollbar-hide',
);
