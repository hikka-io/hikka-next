'use client';

import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import AuthModal from '@/components/modals/auth-modal/auth-modal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/utils';

interface State {
    open: boolean;
    className?: string;
    title?: string;
    content: ReactNode;
    type?: 'dialog' | 'sheet';
    side?: 'left' | 'right';
}

interface ContextProps extends State {
    openModal: ({
        content,
        title,
        className,
    }: {
        content: State['content'];
        title?: State['title'];
        className?: State['className'];
        type?: State['type'];
        side?: State['side'];
    }) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ContextProps>({
    ...getInitialState(),
    openModal: ({}) => null,
    closeModal: () => null,
});

interface Props {
    children: ReactNode;
}

function getInitialState(): State {
    return {
        open: false,
        className: '',
        title: '',
        content: null,
        type: 'dialog',
        side: 'left',
    };
}

export const useModalContext = () => {
    return useContext(ModalContext);
};

export default function ModalProvider({ children }: Props) {
    const searchParams = useSearchParams();
    const modal = searchParams.get('modal');

    const pathname = usePathname();
    const [state, setState] = useState<State>(getInitialState());

    const openModal = ({
        content,
        title,
        className,
        type,
        side,
    }: {
        content: State['content'];
        title?: State['title'];
        className?: State['className'];
        type?: State['type'];
        side?: State['side'];
    }) => {
        setState({
            ...state,
            open: true,
            content,
            title,
            className,
            side: side || 'left',
            type: type || 'dialog',
        });
    };

    const closeModal = () => {
        setState({
            ...getInitialState(),
            type: state.type,
            side: state.side,
        });
    };

    useEffect(() => {
        if (pathname) {
            closeModal();
        }
    }, [pathname]);

    useEffect(() => {
        if (modal) {
            switch (modal) {
                case 'passwordConfirm':
                    openModal({
                        content: <AuthModal type="passwordConfirm" />,
                        className: 'p-0 max-w-3xl',
                    });
                    break;
            }
        }
    }, [modal]);

    return (
        <ModalContext.Provider
            value={{
                ...state,
                openModal,
                closeModal,
            }}
        >
            {children}

            {state.type === 'sheet' && (
                <Sheet open={state.open} onOpenChange={closeModal}>
                    <SheetContent
                        side={state.side}
                        className={cn(
                            '!max-w-lg flex flex-col pb-0 gap-0',
                            state.className,
                        )}
                    >
                        {state.title && (
                            <SheetHeader>
                                <SheetTitle>{state.title}</SheetTitle>
                            </SheetHeader>
                        )}
                        {state.content}
                    </SheetContent>
                </Sheet>
            )}

            {state.type === 'dialog' && (
                <Dialog open={state.open} onOpenChange={closeModal}>
                    <DialogContent
                        className={cn(
                            'overflow-y-scroll max-h-screen no-scrollbar',
                            state.className,
                        )}
                    >
                        {state.title && (
                            <DialogHeader>
                                <DialogTitle>{state.title}</DialogTitle>
                            </DialogHeader>
                        )}
                        {state.content}
                    </DialogContent>
                </Dialog>
            )}
        </ModalContext.Provider>
    );
}