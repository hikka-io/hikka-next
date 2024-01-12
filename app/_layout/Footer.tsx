'use client';

import MingcuteTelegramFill from '~icons/mingcute/telegram-fill';
import SimpleIconsBuymeacoffee from '~icons/simple-icons/buymeacoffee';

import Link from 'next/link';

import RightholderModal from '@/app/_layout/rightholderModal/RightholderModal';
import { useModalContext } from '@/utils/providers/ModalProvider';

const Component = () => {
    const { switchModal } = useModalContext();

    return (
        <footer className="w-full border-t border-t-secondary md:mt-12">
            <div className="container mx-auto max-w-screen-xl p-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                        <Link
                            href="https://t.me/hikka_io"
                            target="_blank"
                            className="btn btn-ghost btn-sm"
                        >
                            <MingcuteTelegramFill />
                            Telegram
                        </Link>
                        <Link
                            href="https://www.buymeacoffee.com"
                            target="_blank"
                            className="btn btn-ghost btn-sm"
                        >
                            <SimpleIconsBuymeacoffee />
                            Buy Me a Coffee
                        </Link>
                        <button
                            onClick={() => switchModal('rightholder')}
                            className="btn btn-ghost btn-sm"
                        >
                            Правовласникам
                        </button>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
                        <p id="hikka-footer-label" className="label-text">
                            © {(new Date()).getFullYear()} Hikka
                        </p>
                    </div>
                </div>
            </div>
            <RightholderModal />
        </footer>
    );
};

export default Component;
