import type { FC } from 'react';

import { Button, Circle, HStack, Image, Spacer, Text } from '@expo/ui/swift-ui';
import {
    buttonStyle,
    contentShape,
    font,
    foregroundColor,
    frame,
    shapes,
} from '@expo/ui/swift-ui/modifiers';

type Props = {
    name: string;
    color: string;
    selected: boolean;
    onPress: () => void;
};

const SWATCH_SIZE = 22;

const AccentRow: FC<Props> = ({ name, color, selected, onPress }) => (
    <Button onPress={onPress} modifiers={[buttonStyle('plain')]}>
        <HStack spacing={12} modifiers={[contentShape(shapes.rectangle())]}>
            <Circle
                modifiers={[
                    foregroundColor(color),
                    frame({ width: SWATCH_SIZE, height: SWATCH_SIZE }),
                ]}
            />
            <Text>{name}</Text>
            <Spacer />
            {selected ? (
                <Image
                    systemName="checkmark"
                    size={15}
                    modifiers={[font({ weight: 'semibold' })]}
                />
            ) : null}
        </HStack>
    </Button>
);

export default AccentRow;
