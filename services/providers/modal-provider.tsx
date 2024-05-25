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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import { cn } from '@/utils/utils';

import { useMediaQuery } from '../hooks/use-media-query';

interface State {
    open: boolean;
    className?: string;
    title?: string;
    content: ReactNode;
    type?: 'dialog' | 'sheet';
    side?: 'left' | 'right';
    forceModal?: boolean;
}

interface ContextProps extends State {
    openModal: (props: {
        content: State['content'];
        title?: State['title'];
        className?: State['className'];
        type?: State['type'];
        side?: State['side'];
        forceModal?: State['forceModal'];
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
        forceModal: false,
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
        className,
        type,
        side,
        forceModal,
    }: {
        content: State['content'];
        title?: State['title'];
        className?: State['className'];
        type?: State['type'];
        side?: State['side'];
        forceModal?: State['forceModal'];
    }) => {
        setState({
            ...state,
            open: true,
            content,
            title,
            className,
            side: side || 'left',
            type: type || 'dialog',
            forceModal,
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
                        className={cn(
                            'max-h-[90dvh] p-4 pt-0',
                            state.className,
                        )}
                    >
                        {state.title && (
                            <DrawerHeader className="px-0 text-left">
                                <DrawerTitle>{state.title}</DrawerTitle>
                            </DrawerHeader>
                        )}
                        {state.content}
                    </DrawerContent>
                </Drawer>
            )}

            {(isDesktop || state.forceModal) && state.type === 'sheet' && (
                <Sheet open={state.open} onOpenChange={closeModal}>
                    <SheetContent
                        side={state.side}
                        className={cn(
                            'flex !max-w-lg flex-col gap-0 pb-0',
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

            {(isDesktop || state.forceModal) && state.type === 'dialog' && (
                <Dialog open={state.open} onOpenChange={closeModal}>
                    <DialogContent
                        className={cn(
                            'no-scrollbar max-h-[90dvh] overflow-y-scroll',
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
