import {
    type ComponentProps,
    type FC,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Eye, EyeOff } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

import { useFieldChain } from './field-chain';
import FormMessage from './form-message';

type Props = ComponentProps<typeof TextInput> & {
    label: string;
    description?: string;
    error?: string;
    /** A password field: hidden by default, with a show/hide button. */
    revealable?: boolean;
};

const TextField: FC<Props> = ({
    label,
    description,
    error,
    onSubmitEditing,
    returnKeyType,
    submitBehavior,
    revealable = false,
    secureTextEntry,
    ...props
}) => {
    const inputRef = useRef<TextInput>(null);
    const [revealed, setRevealed] = useState(false);
    const chain = useFieldChain();
    const register = chain?.register;

    useEffect(() => register?.(inputRef), [register]);

    const index = chain?.fields.indexOf(inputRef) ?? -1;
    const next = chain && index >= 0 ? chain.fields[index + 1] : undefined;
    const last = chain && index >= 0 && !next;

    return (
        <View className="gap-1.5">
            <Text className="font-medium text-sm">{label}</Text>
            <View className="justify-center">
                <TextInput
                    ref={inputRef}
                    className={cn(
                        'h-12 rounded-lg border border-border bg-secondary/20 px-3 text-base text-foreground',
                        revealable && 'pr-12',
                    )}
                    secureTextEntry={revealable ? !revealed : secureTextEntry}
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
                {revealable ? (
                    <Button
                        variant="ghost"
                        size="icon-md"
                        accessibilityLabel={
                            revealed ? 'Приховати пароль' : 'Показати пароль'
                        }
                        containerClassName="absolute right-0"
                        onPress={() => setRevealed((value) => !value)}
                    >
                        <Icon
                            as={revealed ? EyeOff : Eye}
                            className="text-muted-foreground"
                        />
                    </Button>
                ) : null}
            </View>
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
