import type { FC } from 'react';

import type { ListItemProps } from '@expo/ui';
import { Column, Row, Text } from '@expo/ui/jetpack-compose';
import {
    clickable,
    fillMaxWidth,
    padding,
    weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useCSSVariable } from 'uniwind';

const ROW_PADDING_DP = 12;

// Inside a FieldGroup section each row already sits in a Material list item; a nested ListItem would draw a second container, so the row is bare content.
const SettingsListItem: FC<ListItemProps> = ({
    children,
    onPress,
    supportingText,
    leading,
    trailing,
    colors,
    modifiers,
}) => {
    const muted = useCSSVariable('--color-muted-foreground');

    return (
        <Row
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 16 }}
            modifiers={[
                fillMaxWidth(),
                ...(onPress ? [clickable(onPress)] : []),
                padding(0, ROW_PADDING_DP, 0, ROW_PADDING_DP),
                ...(modifiers ?? []),
            ]}
        >
            {leading}
            <Column modifiers={[weight(1)]}>
                <Text
                    color={
                        typeof colors?.contentColor === 'string'
                            ? colors.contentColor
                            : undefined
                    }
                >
                    {children}
                </Text>
                {supportingText != null ? (
                    <Text
                        color={typeof muted === 'string' ? muted : undefined}
                        style={{ typography: 'bodyMedium' }}
                    >
                        {supportingText}
                    </Text>
                ) : null}
            </Column>
            {trailing}
        </Row>
    );
};

export default SettingsListItem;
