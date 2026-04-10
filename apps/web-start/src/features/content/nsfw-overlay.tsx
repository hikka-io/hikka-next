import { FC, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

import { setNsfwConsentFn } from '@/utils/cookies/server';
import { useRouter } from '@/utils/navigation';

const NsfwOverlay: FC = () => {
    const router = useRouter();
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        if (confirmed) return;

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [confirmed]);

    const handleConfirm = () => {
        setConfirmed(true);
        setNsfwConsentFn();
    };

    if (confirmed) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden backdrop-blur-xl">
            <div
                aria-hidden
                className="bg-background/80 pointer-events-none absolute inset-0"
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
                    <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                        Контент 18+
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Відвертий контент
                    </h1>
                    <p className="text-muted-foreground">
                        Ця сторінка містить контент для дорослих. Продовжуючи,
                        ви підтверджуєте, що вам виповнилося 18 років.
                    </p>
                </div>

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
