'use client';

import {
    BulletedListPlugin,
    ListItemContentPlugin,
    ListItemPlugin,
    ListPlugin,
    NumberedListPlugin,
} from '@platejs/list-classic/react';

import {
    BulletedListElement,
    ListItemElement,
    NumberedListElement,
} from '@/components/plate/ui/list-classic-node';

export const ListKit = [
    ListPlugin,
    ListItemPlugin,
    ListItemContentPlugin,
    BulletedListPlugin.configure({
        node: { component: BulletedListElement },
        shortcuts: { toggle: { keys: 'mod+alt+6' } },
    }),
    NumberedListPlugin.configure({
        node: { component: NumberedListElement },
        shortcuts: { toggle: { keys: 'mod+alt+7' } },
    }),
    ListItemPlugin.withComponent(ListItemElement),
];
