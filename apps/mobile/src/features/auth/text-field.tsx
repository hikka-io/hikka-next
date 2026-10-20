import { type ComponentProps, type FC, useEffect, useRef } from 'react';

import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';

import { useFieldChain } from './field-chain';
import FormMessage from './form-message';

type Props = ComponentProps<typeof TextInput> & {
    label: string;
    description?: string;
    error?: string;
};

const TextField: FC<Props> = ({
    label,
    description,
    error,
    onSubmitEditing,
    returnKeyType,
    submitBehavior,
    ...props
}) => {
    const inputRef = useRef<TextInput>(null);
    const chain = useFieldChain();
    const register = chain?.register;

    useEffect(() => register?.(inputRef), [register]);

    const index = chain?.fields.indexOf(inputRef) ?? -1;
    const next = chain && index >= 0 ? chain.fields[index + 1] : undefined;
    const last = chain && index >= 0 && !next;

    return (
        <View className="gap-1.5">
            <Text className="font-medium text-sm">{label}</Text>
            <TextInput
                ref={inputRef}
                className="h-12 rounded-lg border border-border bg-secondary/20 px-3 text-base text-foreground"
                placeholderTextColorClassName="accent-muted-foreground"
                accessibilityLabel={label}
                accessibilityHint={error ?? description}
                returnKeyType={next ? 'next' : last ? 'go' : returnKeyType}
                submitBehavior={next ? 'submit' : submitBehavior}
                onSubmitEditing={(event) => {
                    if (next) next.current?.focus();
                    else if (last) chain.submit();
                    else onSubmitEditing?.(event);
                }}
                {...props}
            />
            {description && !error ? (
                <Text className="text-muted-foreground text-xs">
                    {description}
                </Text>
            ) : null}
            <FormMessage message={error} />
        </View>
    );
};

export default TextField;
