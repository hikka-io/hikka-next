import type { FC } from 'react';

import { Button, HStack, Image, LabeledContent, Text } from '@expo/ui/swift-ui';
import {
    buttonStyle,
    contentShape,
    font,
    foregroundStyle,
    shapes,
} from '@expo/ui/swift-ui/modifiers';
import { type Href, useRouter } from 'expo-router';

type Props = {
    title: string;
    href: Href;
    value?: string;
};

// The Settings app row: the title leading, an optional value and a chevron trailing.
const SettingsNavRow: FC<Props> = ({ title, href, value }) => {
    const router = useRouter();

    return (
        <Button
            onPress={() => router.push(href)}
            modifiers={[buttonStyle('plain')]}
        >
            <LabeledContent
                label={title}
                modifiers={[contentShape(shapes.rectangle())]}
            >
                <HStack spacing={8}>
                    {value ? (
                        <Text
                            modifiers={[
                                foregroundStyle({
                                    type: 'hierarchical',
                                    style: 'secondary',
                                }),
                            ]}
                        >
                            {value}
                        </Text>
                    ) : null}
                    <Image
                        systemName="chevron.right"
                        size={13}
                        modifiers={[
                            font({ weight: 'semibold' }),
                            foregroundStyle({
                                type: 'hierarchical',
                                style: 'tertiary',
                            }),
                        ]}
                    />
                </HStack>
            </LabeledContent>
        </Button>
    );
};

export default SettingsNavRow;
