import type { FC } from 'react';

import { useMutation } from '@tanstack/react-query';
import { View } from 'react-native';
import { toast } from 'sonner-native';

import { activationResendMutation, HikkaApiError } from '@hikka/api';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { toastApiError } from '@/utils/offline-toast';

import { FALLBACK_ERROR } from './constants';

const ACTIVATION_VALID = 'auth:activation_valid';

type Props = {
    username: string;
};

const ActivationAlert: FC<Props> = ({ username }) => {
    const resend = useMutation({
        ...activationResendMutation(),
        onSuccess: () =>
            toast.success(
                `${username}, ми успішно надіслали Вам лист для підтвердження поштової адреси.`,
            ),
        onError: (error) =>
            error instanceof HikkaApiError && error.code === ACTIVATION_VALID
                ? toast.error(
                      `${username}, Ваше посилання досі активне. Перегляньте, будь ласка, вашу поштову скриньку для активації акаунту.`,
                  )
                : toastApiError(error, FALLBACK_ERROR),
    });

    return (
        <Card variant="surface" className="gap-3 p-4">
            <Text className="text-sm">
                На вашу пошту відправлено лист з активацією пошти. Будь ласка,
                перейдіть за посилання у листі. Якщо Ваш лист не прийшов, будь
                ласка, відправте його повторно.
            </Text>
            <View className="flex-row">
                <Button
                    variant="secondary"
                    size="md"
                    disabled={resend.isPending}
                    onPress={() => resend.mutate({})}
                >
                    Відправити повторно
                </Button>
            </View>
        </Card>
    );
};

export default ActivationAlert;
