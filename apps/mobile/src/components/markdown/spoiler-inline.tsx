import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import { Text } from 'react-native';

type Props = {
    text: string;
    children: ReactNode;
};

const SpoilerInline: FC<Props> = ({ text, children }) => {
    const [revealed, setRevealed] = useState(false);

    if (revealed) {
        return <Text className="bg-muted-foreground/10">{children}</Text>;
    }

    return (
        <Text
            accessibilityRole="button"
            accessibilityLabel="Показати спойлер"
            className="bg-muted-foreground/30 text-transparent"
            onPress={() => setRevealed(true)}
        >
            {text}
        </Text>
    );
};

export default SpoilerInline;
