import { type FC, Fragment, type ReactNode, useState } from 'react';

import type { MenuAction } from '@expo/ui/community/menu';
import {
    DropdownMenu,
    DropdownMenuItem,
    HorizontalDivider,
    Host,
    Icon,
    RNHostView,
    Text,
    useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { selectable } from '@expo/ui/jetpack-compose/modifiers';
import { Pressable, useColorScheme, View } from 'react-native';

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

const CHECK_ICON = require('../../../assets/icons/check.xml');
const CHECK_SIZE = 24;
const noop = () => {};

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

    const choose = (action: MenuAction) => {
        setExpanded(false);
        onAction(actionId(action));
    };

    const renderAction = (action: MenuAction): ReactNode => {
        if (action.attributes?.hidden) return null;

        if (action.subactions?.length) {
            return (
                <Fragment key={actionId(action)}>
                    <HorizontalDivider />
                    {action.subactions.map(renderAction)}
                </Fragment>
            );
        }

        const disabled = action.attributes?.disabled;
        const color =
            action.attributes?.destructive && !disabled
                ? destructive
                : undefined;
        const checkable = action.state != null;

        return (
            <DropdownMenuItem
                key={actionId(action)}
                enabled={!disabled}
                elementColors={color ? { textColor: color } : undefined}
                modifiers={
                    checkable
                        ? [
                              selectable(
                                  action.state === 'on',
                                  noop,
                                  'radioButton',
                              ),
                          ]
                        : undefined
                }
                onClick={() => choose(action)}
            >
                <DropdownMenuItem.Text>
                    <Text>{action.title}</Text>
                </DropdownMenuItem.Text>
                {action.state === 'on' ? (
                    <DropdownMenuItem.TrailingIcon>
                        <Icon source={CHECK_ICON} size={CHECK_SIZE} />
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
            >
                <DropdownMenu.Trigger>
                    <RNHostView matchContents>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={accessibilityLabel}
                            onPress={() => setExpanded(true)}
                            android_disableSound
                            style={{
                                width,
                                height,
                                justifyContent: 'center',
                            }}
                        >
                            <View importantForAccessibility="no-hide-descendants">
                                {children}
                            </View>
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

export default NativeMenu;
