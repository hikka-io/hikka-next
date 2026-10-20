import { type FC, useEffect } from 'react';

import { AccessibilityInfo, Platform, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

type Props = {
    message?: string | null;
    tone?: 'error' | 'info';
    className?: string;
};

// The wrapper stays mounted so Android's live region sees the change; iOS needs an explicit announcement.
const FormMessage: FC<Props> = ({ message, tone = 'error', className }) => {
    useEffect(() => {
        if (message && Platform.OS === 'ios') {
            AccessibilityInfo.announceForAccessibility(message);
        }
    }, [message]);

    return (
        <View accessibilityLiveRegion="polite">
            {message ? (
                <Text
                    className={cn(
                        'text-sm',
                        tone === 'error' && 'text-destructive-foreground',
                        className,
                    )}
                >
                    {message}
                </Text>
            ) : null}
        </View>
    );
};

export default FormMessage;
