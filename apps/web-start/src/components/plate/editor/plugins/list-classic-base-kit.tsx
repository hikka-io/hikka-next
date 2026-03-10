import {
    BaseBulletedListPlugin,
    BaseListItemContentPlugin,
    BaseListItemPlugin,
    BaseListPlugin,
    BaseNumberedListPlugin,
} from '@platejs/list-classic';

import {
    BulletedListElementStatic,
    ListItemElementStatic,
    NumberedListElementStatic,
} from '@/components/plate/ui/list-classic-node-static';

export const BaseListKit = [
    BaseListPlugin,
    BaseListItemPlugin,
    BaseListItemContentPlugin,
    BaseBulletedListPlugin.configure({
        node: { component: BulletedListElementStatic },
        shortcuts: { toggle: { keys: 'mod+alt+6' } },
    }),
    BaseNumberedListPlugin.configure({
        node: { component: NumberedListElementStatic },
        shortcuts: { toggle: { keys: 'mod+alt+7' } },
    }),
    BaseListItemPlugin.withComponent(ListItemElementStatic),
];
