import { type FC, useEffect, useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { toast } from 'sonner-native';

import { activationMutation, getAuthToken } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { queryClient } from '@/utils/query-client';

import AuthHeader from './auth-header';
import { errorMessage } from './error-message';
import FormMessage from './form-message';
import { signIn } from './session';
import { useSession } from './use-session';

type State =
    | { kind: 'pending' }
    | { kind: 'error'; message: string }
    | { kind: 'sign-in-failed' };

type Props = {
    token: string;
    onDone: () => void;
};

const confirmReplace = (username: string | null | undefined) =>
    new Promise<boolean>((resolve) =>
        Alert.alert(
            'Пошту підтверджено',
            username
                ? `Ви вже увійшли як ${username}. Увійти в підтверджений акаунт замість нього?`
                : 'Ви вже увійшли в акаунт. Увійти в підтверджений акаунт замість нього?',
            [
                {
                    text: 'Залишитись',
                    style: 'cancel',
                    onPress: () => resolve(false),
                },
                { text: 'Увійти', onPress: () => resolve(true) },
            ],
            { cancelable: false },
        ),
    );

// A link can belong to any account, so an existing session is replaced only after the user agrees.
// The token is single use: the request is keyed by it, so a re-render never repeats it but a new link runs again.
const Activation: FC<Props> = ({ token, onDone }) => {
    const router = useRouter();
    const { user } = useSession();
    const { mutateAsync } = useMutation(activationMutation());

    const latest = useRef({ username: user?.username, onDone });
    latest.current = { username: user?.username, onDone };
    const startedFor = useRef<string>(undefined);

    const [state, setState] = useState<State>({ kind: 'pending' });

    useEffect(() => {
        if (startedFor.current === token) return;
        startedFor.current = token;
        setState({ kind: 'pending' });

        const run = async () => {
            let secret: string;

            try {
                ({ secret } = await mutateAsync({ body: { token } }));
            } catch (error) {
                setState({ kind: 'error', message: errorMessage(error) });
                return;
            }

            try {
                if (
                    getAuthToken() &&
                    !(await confirmReplace(latest.current.username))
                ) {
                    void queryClient.resetQueries();
                } else {
                    await signIn(secret);
                }
            } catch {
                setState({ kind: 'sign-in-failed' });
                return;
            }

            toast.success('Пошту успішно підтверджено.');
            latest.current.onDone();
        };

        void run();
    }, [mutateAsync, token]);

    return (
        <View className="gap-4 bg-background p-6">
            <AuthHeader title="Підтвердження пошти">
                {state.kind === 'pending'
                    ? 'Підтверджуємо вашу поштову адресу'
                    : state.kind === 'sign-in-failed'
                      ? 'Пошту підтверджено'
                      : 'Не вдалося підтвердити пошту'}
            </AuthHeader>

            {state.kind === 'pending' ? <Spinner /> : null}

            {state.kind === 'error' ? (
                <>
                    <FormMessage message={state.message} />
                    <Button
                        variant="secondary"
                        containerClassName="self-stretch"
                        className="w-full"
                        onPress={onDone}
                    >
                        Закрити
                    </Button>
                </>
            ) : null}

            {state.kind === 'sign-in-failed' ? (
                <>
                    <FormMessage
                        tone="info"
                        className="text-foreground"
                        message="Акаунт активовано, але не вдалося увійти автоматично. Увійдіть зі своїм паролем."
                    />
                    <Button
                        containerClassName="self-stretch"
                        className="w-full"
                        onPress={() => router.replace('/login')}
                    >
                        Увійти
                    </Button>
                </>
            ) : null}
        </View>
    );
};

export default Activation;
