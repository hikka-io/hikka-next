'use client'

import MingcuteTelegramFill from '~icons/mingcute/telegram-fill';
import SimpleIconsBuymeacoffee from '~icons/simple-icons/buymeacoffee'
import Link from "next/link";
import RightholderModal from "@/app/_layout/rightholderModal/RightholderModal";
import {useModalContext} from "@/utils/providers/ModalProvider";

const Component = () => {
    const { switchModal } = useModalContext();

    return (
        <footer className="md:mt-12 w-full border-t border-t-secondary">
            <div className="container max-w-screen-xl mx-auto p-4">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                    <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                        <Link href="https://t.me/hikka_io" target="_blank" className="btn btn-ghost btn-sm">
                            <MingcuteTelegramFill />
                            Telegram
                        </Link>
                        <Link href="https://www.buymeacoffee.com" target="_blank" className="btn btn-ghost btn-sm">
                            <SimpleIconsBuymeacoffee />
                            Buy Me a Coffee
                        </Link>
                        <button onClick={() => switchModal('rightholder')} className="btn btn-ghost btn-sm">
                            Правовласникам
                        </button>
                    </div>
                    <div className="flex lg:justify-end justify-center items-center">
                        <p id="hikka-footer-label" className="label-text">© 2023 Hikka</p>
                    </div>
                </div>
            </div>
            <RightholderModal />
        </footer>
    );
};

export default Component;
