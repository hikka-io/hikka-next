import { type FC, useEffect, useState } from 'react';

import { getAuthToken } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from '@/components/ui/image';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { setNsfwConsentFn } from '@/utils/cookies/server';
import { useRouter } from '@/utils/navigation';

import { grantNsfwSessionConsent, hasNsfwSessionConsent } from './nsfw-consent';

const NsfwOverlay: FC = () => {
    const router = useRouter();
    const { update } = useUpdateSessionUI();
    const [dismissed, setDismissed] = useState(() => {
        if (hasNsfwSessionConsent()) return true;
        if (typeof document === 'undefined') return false;
        return document.cookie.includes('nsfw_confirmed=');
    });
    const [remember, setRemember] = useState(false);

    const isAuthenticated = !!getAuthToken();

    useEffect(() => {
        if (dismissed) return;

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [dismissed]);

    const handleConfirm = async () => {
        if (remember) {
            if (getAuthToken()) {
                update({ preferences: { show_nsfw: true } });
            } else {
                await setNsfwConsentFn();
            }
        }
        grantNsfwSessionConsent();
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden backdrop-blur-xl">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-background opacity-80"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_55%)] opacity-60"
            />

            <div className="relative flex w-full max-w-md flex-col items-center gap-6 px-6 text-center">
                <Image
                    src="/stickers/hmm.webp"
                    width={224}
                    height={224}
                    background="transparent"
                    className="size-56"
                    alt="hikka mascot"
                />

                <div className="flex flex-col gap-2">
                    <p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
                        Контент 18+
                    </p>
                    <h1 className="font-bold text-3xl tracking-tight md:text-4xl">
                        Відвертий контент
                    </h1>
                    <p className="text-muted-foreground">
                        Ця сторінка містить контент для дорослих. Продовжуючи,
                        ви підтверджуєте, що вам виповнилося 18 років.
                    </p>
                </div>

                {/* biome-ignore lint/a11y/noLabelWithoutControl: wraps a Radix Checkbox, which renders a labelable button the rule doesn't detect. */}
                <label
                    className="flex cursor-pointer items-center gap-2"
                    title={
                        isAuthenticated
                            ? 'Вибір буде збережено в налаштуваннях'
                            : 'Вибір буде збережено на 7 днів'
                    }
                >
                    <Checkbox
                        checked={remember}
                        onCheckedChange={(checked) =>
                            setRemember(checked === true)
                        }
                    />
                    <span className="text-muted-foreground text-sm">
                        Запам'ятати мій вибір
                    </span>
                </label>

                <div className="flex w-full flex-col gap-3 sm:flex-row">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() =>
                            window.history.length > 1
                                ? router.back()
                                : router.push('/')
                        }
                    >
                        Назад
                    </Button>
                    <Button className="flex-1" onClick={handleConfirm}>
                        Мені є 18 років
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NsfwOverlay;
