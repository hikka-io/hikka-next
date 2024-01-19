'use client';

import MingcuteTelegramFill from '~icons/mingcute/telegram-fill';
import SimpleIconsBuymeacoffee from '~icons/simple-icons/buymeacoffee';

import Link from 'next/link';

import { Button } from '@/app/_components/ui/button';
import RightholderModal from '@/app/_layout/rightholder-modal/rightholder-modal';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Label } from '@/app/_components/ui/label';


const Component = () => {
    const { switchModal } = useModalContext();

    return (
        <footer className="w-full border-t border-t-secondary md:mt-12">
            <div className="container mx-auto max-w-screen-xl p-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="https://t.me/hikka_io" target="_blank">
                                <MingcuteTelegramFill />
                                Telegram
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href="https://www.buymeacoffee.com/hikka"
                                target="_blank"
                            >
                                <SimpleIconsBuymeacoffee />
                                Buy Me a Coffee
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => switchModal('rightholder')}
                        >
                            Правовласникам
                        </Button>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
                        <Label id="hikka-footer-label" className="text-muted-foreground">
                            © {new Date().getFullYear()} Hikka
                        </Label>
                    </div>
                </div>
            </div>
            <RightholderModal />
        </footer>
    );
};

export default Component;