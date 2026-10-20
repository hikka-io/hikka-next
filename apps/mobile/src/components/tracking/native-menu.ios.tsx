import type { FC, ReactNode } from 'react';

import type { MenuAction } from '@expo/ui/community/menu';
import {
    Button,
    Host,
    Menu,
    RNHostView,
    Section,
    Toggle,
} from '@expo/ui/swift-ui';
import { View } from 'react-native';

import type { NativeMenuProps } from './native-menu';

const renderAction = (
    action: MenuAction,
    onAction: (id: string) => void,
): ReactNode => {
    const id = action.id ?? action.title;
    const systemImage =
        typeof action.image === 'string' ? action.image : undefined;

    if (action.subactions?.length) {
        return (
            <Section key={id} title={action.title || undefined}>
                {action.subactions.map((sub) => renderAction(sub, onAction))}
            </Section>
        );
    }

    if (action.state) {
        return (
            <Toggle
                key={id}
                label={action.title}
                systemImage={systemImage}
                isOn={action.state === 'on'}
                onIsOnChange={() => onAction(id)}
            />
        );
    }

    return (
        <Button
            key={id}
            label={action.title}
            systemImage={systemImage}
            role={action.attributes?.destructive ? 'destructive' : undefined}
            onPress={() => onAction(id)}
        />
    );
};

/**
 * iOS: a SwiftUI `Menu` whose label is our React Native trigger. The community `MenuView`
 * sizes its host from the content, which leaves it zero-sized in Yoga and untappable, so
 * the host here takes an explicit box and the label fills it.
 */
const NativeMenu: FC<NativeMenuProps> = ({
    actions,
    onAction,
    width,
    height,
    title,
    children,
}) => {
    const items = actions.map((action) => renderAction(action, onAction));

    return (
        <Host style={{ width, height }} ignoreSafeArea="all">
            <Menu
                label={
                    <RNHostView>
                        <View style={{ width, height }}>{children}</View>
                    </RNHostView>
                }
            >
                {title ? <Section title={title}>{items}</Section> : items}
            </Menu>
        </Host>
    );
};

export default NativeMenu;
