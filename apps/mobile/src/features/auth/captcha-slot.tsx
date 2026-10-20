import type { FC } from 'react';

import { View } from 'react-native';

import { Text } from '@/components/ui/text';

import Captcha from './captcha';
import { CAPTCHA_BYPASS } from './captcha-config';
import type { useCaptchaGate } from './use-captcha-gate';

type Props = {
    gate: ReturnType<typeof useCaptchaGate>;
};

const CaptchaSlot: FC<Props> = ({ gate }) => (
    <>
        {CAPTCHA_BYPASS ? null : (
            <View className="items-center">
                <Captcha key={gate.widgetKey} onToken={gate.onToken} />
            </View>
        )}
        {gate.waiting && !gate.token ? (
            <Text className="text-muted-foreground text-sm">
                Зачекайте, поки завершиться перевірка
            </Text>
        ) : null}
    </>
);

export default CaptchaSlot;
