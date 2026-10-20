import { type FC, useEffect, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';
import { toast } from 'sonner-native';

import { activationMutation } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import AuthHeader from './auth-header';
import { errorMessage } from './error-message';
import { signIn } from './session';

type Props = {
    token: string;
    onDone: () => void;
};

// The token is single use, so the request is guarded against effect re-runs.
const Activation: FC<Props> = ({ token, onDone }) => {
    const started = useRef(false);

    const activation = useMutation({
        ...activationMutation(),
        onSuccess: async ({ secret }) => {
            await signIn(secret);
            toast.success('Пошту успішно підтверджено.');
            onDone();
        },
    });
    const { mutate } = activation;

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        mutate({ body: { token } });
    }, [mutate, token]);

    return (
        <View className="gap-4 bg-background p-6">
            <AuthHeader title="Підтвердження пошти">
                {activation.error
                    ? 'Не вдалося підтвердити пошту'
                    : 'Підтверджуємо вашу поштову адресу'}
            </AuthHeader>

            {activation.error ? (
                <>
                    <Text className="text-destructive-foreground text-sm">
                        {errorMessage(activation.error)}
                    </Text>
                    <Button
                        variant="secondary"
                        containerClassName="self-stretch"
                        className="w-full"
                        onPress={onDone}
                    >
                        Закрити
                    </Button>
                </>
            ) : (
                <ActivityIndicator />
            )}
        </View>
    );
};

export default Activation;
