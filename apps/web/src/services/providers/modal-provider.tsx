'use client';

import { usePathname } from 'next/navigation';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import { cn } from '@/utils/cn';

import { useMediaQuery } from '../hooks/use-media-query';

interface State {
    open: boolean;
    className?: string;
    containerClassName?: string;
    title?: string;
    description?: string;
    content: ReactNode;
    type?: 'dialog' | 'sheet';
    side?: 'left' | 'right';
    forceModal?: boolean;
    onClose?: () => void;
}

interface ContextProps extends State {
    openModal: (props: {
        content: State['content'];
        description?: State['description'];
        title?: State['title'];
        className?: State['className'];
        containerClassName?: State['containerClassName'];
        type?: State['type'];
        side?: State['side'];
        forceModal?: State['forceModal'];
        onClose?: State['onClose'];
    }) => void;
    closeModal: (open?: boolean) => void;
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
        forceModal: false,
        containerClassName: '',
        onClose: () => null,
    };
}

export const useModalContext = () => {
    return useContext(ModalContext);
};

export default function ModalProvider({ children }: Props) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const pathname = usePathname();
    const [state, setState] = useState<State>(getInitialState());

    const openModal = ({
        content,
        title,
        description,
        className,
        type,
        side,
        forceModal,
        containerClassName,
        onClose,
    }: {
        content: State['content'];
        title?: State['title'];
        description?: State['description'];
        className?: State['className'];
        type?: State['type'];
        side?: State['side'];
        forceModal?: State['forceModal'];
        containerClassName?: State['containerClassName'];
        onClose?: State['onClose'];
    }) => {
        setState({
            ...state,
            open: true,
            content,
            title,
            description,
            className,
            side: side ?? 'left',
            type: type ?? 'dialog',
            forceModal,
            containerClassName,
            onClose,
        });
    };

    const closeModal = (open?: boolean) => {
        setState({
            ...getInitialState(),
            type: state.type,
            side: state.side,
        });

        if (state?.onClose && !open) {
            state.onClose();
        }
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

            {!isDesktop && !state.forceModal && (
                <Drawer
                    preventScrollRestoration
                    open={state.open}
                    onOpenChange={(open) => setState({ ...state, open })}
                >
                    <DrawerContent
                        className={cn('max-h-[90dvh]', state.className)}
                    >
                        {state.title ? (
                            <DrawerHeader>
                                <DrawerTitle>{state.title}</DrawerTitle>
                                {state.description && (
                                    <DrawerDescription>
                                        {state.description}
                                    </DrawerDescription>
                                )}
                            </DrawerHeader>
                        ) : (
                            <DrawerTitle className="hidden" />
                        )}
                        <Separator />
                        {state.content}
                    </DrawerContent>
                </Drawer>
            )}

            {(isDesktop || state.forceModal) && state.type === 'sheet' && (
                <Sheet open={state.open} onOpenChange={closeModal}>
                    <SheetContent
                        side={state.side}
                        className={cn(
                            'flex !max-w-lg flex-col gap-0 p-0',
                            state.className,
                        )}
                    >
                        {state.title ? (
                            <SheetHeader className="px-6 py-4">
                                <SheetTitle>{state.title}</SheetTitle>
                                {state.description && (
                                    <SheetDescription>
                                        {state.description}
                                    </SheetDescription>
                                )}
                            </SheetHeader>
                        ) : (
                            <SheetTitle className="hidden" />
                        )}
                        <Separator />
                        {state.content}
                    </SheetContent>
                </Sheet>
            )}

            {(isDesktop || state.forceModal) && state.type === 'dialog' && (
                <Dialog open={state.open} onOpenChange={closeModal}>
                    <DialogContent className={cn(state.className)}>
                        {state.title ? (
                            <DialogHeader>
                                <DialogTitle>{state.title}</DialogTitle>
                                {state.description && (
                                    <DialogDescription>
                                        {state.description}
                                    </DialogDescription>
                                )}
                            </DialogHeader>
                        ) : (
                            <DialogTitle className="hidden" />
                        )}
                        {state.content}
                    </DialogContent>
                </Dialog>
            )}
        </ModalContext.Provider>
    );
}
