import type { FC } from 'react';

import { ImageOff } from 'lucide-react-native';
import { View } from 'react-native';

import type { PersonResponse } from '@hikka/api';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type Props = {
    person: Partial<
        Pick<PersonResponse, 'name_native' | 'name_en' | 'name_ua'>
    >;
};

const PersonPlaceholder: FC<Props> = ({ person }) => {
    const name = (
        person.name_native ||
        person.name_en ||
        person.name_ua ||
        ''
    ).trim();
    const glyph = Array.from(name)[0]?.toLocaleUpperCase();

    if (!glyph) {
        return <Icon as={ImageOff} className="size-9 text-muted-foreground" />;
    }

    return (
        <View className="size-full items-center justify-center">
            <Text
                accessibilityElementsHidden
                className="font-serif text-5xl text-muted-foreground"
            >
                {glyph}
            </Text>
        </View>
    );
};

export default PersonPlaceholder;
