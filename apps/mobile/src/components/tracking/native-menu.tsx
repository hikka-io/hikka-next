import type { FC, ReactElement } from 'react';

import { type MenuAction, MenuView } from '@expo/ui/community/menu';

export type NativeMenuProps = {
    actions: MenuAction[];
    onAction: (id: string) => void;
    /** The trigger box: the native host does not size itself in the Yoga layout. */
    width: number;
    height: number;
    title?: string;
    children: ReactElement;
};

/** Android: the community `MenuView` (a Material dropdown anchored to a `Pressable` trigger). */
const NativeMenu: FC<NativeMenuProps> = ({
    actions,
    onAction,
    width,
    height,
    title,
    children,
}) => (
    <MenuView
        title={title}
        actions={actions}
        onPressAction={({ nativeEvent }) => onAction(nativeEvent.event)}
        style={{ width, height }}
    >
        {children}
    </MenuView>
);

export default NativeMenu;
