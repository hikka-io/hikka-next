'use client';

import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { usePathname } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/app/_components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/app/_components/ui/sheet';
import { cn } from '@/utils';

interface State {
    open: boolean;
    className?: string;
    title?: string;
    content: ReactNode;
    type?: 'dialog' | 'sheet';
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
    };
}

export const useModalContext = () => {
    return useContext(ModalContext);
};

export default function ModalProvider({ children }: Props) {
    const pathname = usePathname();
    const [state, setState] = useState<State>(getInitialState());

    const openModal = ({
        content,
        title,
        className,
        type,
    }: {
        content: State['content'];
        title?: State['title'];
        className?: State['className'];
        type?: State['type'];
    }) => {
        setState({
            ...state,
            open: true,
            content,
            title,
            className,
            type: type || 'dialog',
        });
    };

    const closeModal = () => {
        setState({
            ...getInitialState(),
            type: state.type,
        });
    };

    useEffect(() => {
        if (pathname) {
            closeModal();
        }
    }, [pathname]);

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
                        side="left"
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