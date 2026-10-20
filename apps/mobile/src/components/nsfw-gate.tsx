import { type FC, useState } from 'react';

import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';
import SwitchRow from '@/components/ui/switch-row';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { grantNsfwConsent, useUpdateSessionUI } from '@/services/session';
import { siteUrl } from '@/utils/site-origin';

const STICKER = siteUrl('/stickers/hmm.webp');

/** The web's `NsfwOverlay`: an 18+ title stays hidden until the viewer confirms their age. */
const NsfwGate: FC = () => {
    const router = useRouter();
    const { hasToken } = useSession();
    const { update } = useUpdateSessionUI();
    const [remember, setRemember] = useState(false);

    const confirm = () => {
        if (remember && hasToken) {
            update({ preferences: { show_nsfw: true } });
        }
        grantNsfwConsent({ remember: remember && !hasToken });
    };

    const back = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <View className="w-full max-w-md items-center gap-6 self-center pt-4">
            <Image
                source={STICKER}
                contentFit="contain"
                accessibilityIgnoresInvertColors
                accessible={false}
                className="size-48"
            />
            <View className="items-center gap-2">
                <Text className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
                    Контент 18+
                </Text>
                <Text
                    accessibilityRole="header"
                    className="text-center font-bold text-3xl tracking-tight"
                >
                    Відвертий контент
                </Text>
                <Text className="text-center text-base text-muted-foreground">
                    Ця сторінка містить контент для дорослих. Продовжуючи, ви
                    підтверджуєте, що вам виповнилося 18 років.
                </Text>
            </View>
            <View className="w-full">
                <SwitchRow
                    label="Запамʼятати мій вибір"
                    value={remember}
                    onChange={setRemember}
                />
                <Text className="text-muted-foreground text-xs">
                    {hasToken
                        ? 'Вибір буде збережено в налаштуваннях'
                        : 'Вибір буде збережено на 7 днів'}
                </Text>
            </View>
            <View className="w-full gap-3">
                <Button
                    variant="outline"
                    containerClassName="self-stretch"
                    className="w-full"
                    onPress={back}
                >
                    Назад
                </Button>
                <Button
                    containerClassName="self-stretch"
                    className="w-full"
                    onPress={confirm}
                >
                    Мені є 18 років
                </Button>
            </View>
        </View>
    );
};

export default NsfwGate;
