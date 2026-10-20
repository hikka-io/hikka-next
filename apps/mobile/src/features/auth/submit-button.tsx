import type { FC } from 'react';

import { ActivityIndicator } from 'react-native';

import { Button } from '@/components/ui/button';

type Props = {
    label: string;
    busy?: boolean;
    disabled?: boolean;
    onPress: () => void;
};

const SubmitButton: FC<Props> = ({ label, busy, disabled, onPress }) => (
    <Button
        containerClassName="self-stretch"
        className="w-full"
        disabled={disabled || busy}
        accessibilityLabel={label}
        accessibilityState={{ busy, disabled: disabled || busy }}
        onPress={onPress}
    >
        {busy ? (
            <ActivityIndicator colorClassName="accent-primary-foreground" />
        ) : null}
        {label}
    </Button>
);

export default SubmitButton;
