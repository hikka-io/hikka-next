import { type FC, type ReactNode, useState } from 'react';

import type { MenuAction } from '@expo/ui/community/menu';
import {
    DropdownMenu,
    DropdownMenuItem,
    HorizontalDivider,
    Host,
    RNHostView,
    Text,
    useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { Pressable, useColorScheme } from 'react-native';

export type NativeMenuProps = {
    actions: MenuAction[];
    onAction: (id: string) => void;
    /** VoiceOver label of the menu button (iOS; Android reads the trigger's text). */
    accessibilityLabel: string;
    /** The trigger box: the native host does not size itself in the Yoga layout. */
    width: number;
    height: number;
    title?: string;
    children: ReactNode;
};

const actionId = (action: MenuAction) => action.id ?? action.title;

/**
 * Android: a Material `DropdownMenu` anchored to our React Native trigger. The community
 * `MenuView` sizes its host from the content and renders nothing in the Yoga layout, so the
 * host here takes an explicit box like on iOS. Sub-action groups flatten into dividers.
 */
const NativeMenu: FC<NativeMenuProps> = ({
    actions,
    onAction,
    accessibilityLabel,
    width,
    height,
    children,
}) => {
    const scheme = useColorScheme();
    const destructive = useMaterialColors().error;
    const [expanded, setExpanded] = useState(false);

    const renderAction = (action: MenuAction): ReactNode => {
        if (action.attributes?.hidden) return null;

        if (action.subactions?.length) {
            return (
                <Group key={actionId(action)}>
                    <HorizontalDivider />
                    {action.subactions.map(renderAction)}
                </Group>
            );
        }

        const color = action.attributes?.destructive ? destructive : undefined;

        return (
            <DropdownMenuItem
                key={actionId(action)}
                enabled={!action.attributes?.disabled}
                elementColors={
                    color
                        ? { textColor: color, disabledTextColor: color }
                        : undefined
                }
                onClick={() => {
                    setExpanded(false);
                    onAction(actionId(action));
                }}
            >
                <DropdownMenuItem.Text>
                    <Text>{action.title}</Text>
                </DropdownMenuItem.Text>
                {action.state === 'on' ? (
                    <DropdownMenuItem.TrailingIcon>
                        <Text>✓</Text>
                    </DropdownMenuItem.TrailingIcon>
                ) : null}
            </DropdownMenuItem>
        );
    };

    return (
        <Host colorScheme={scheme} style={{ width, height }}>
            <DropdownMenu
                expanded={expanded}
                onDismissRequest={() => setExpanded(false)}
                properties={{ clippingEnabled: false }}
            >
                <DropdownMenu.Trigger>
                    <RNHostView matchContents>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={accessibilityLabel}
                            onPress={() => setExpanded(true)}
                            android_disableSound
                        >
                            {children}
                        </Pressable>
                    </RNHostView>
                </DropdownMenu.Trigger>
                <DropdownMenu.Items>
                    {actions.map(renderAction)}
                </DropdownMenu.Items>
            </DropdownMenu>
        </Host>
    );
};

const Group: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

export default NativeMenu;
