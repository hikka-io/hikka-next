import type { ComponentProps, FC } from 'react';

import { Text, TextInput, View } from 'react-native';

type Props = ComponentProps<typeof TextInput> & {
    label: string;
    error?: string;
};

const TextField: FC<Props> = ({ label, error, ...props }) => (
    <View className="gap-1.5">
        <Text className="font-medium text-foreground text-sm">{label}</Text>
        <TextInput
            className="h-12 rounded-lg border border-border bg-secondary/20 px-3 text-base text-foreground"
            placeholderTextColorClassName="accent-muted-foreground"
            {...props}
        />
        {error ? (
            <Text className="text-destructive-foreground text-sm">{error}</Text>
        ) : null}
    </View>
);

export default TextField;
