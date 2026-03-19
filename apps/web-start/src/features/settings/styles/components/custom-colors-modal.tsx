'use client';

import { Moon, Redo2, Sun, Undo2 } from 'lucide-react';
import {
    Fragment,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';
import { useTheme } from '@/services/providers/theme-provider';
import { stylesToReactStyles } from '@/utils/ui/inject-styles';

import {
    StylesEditorStore,
    StylesEditorStoreWithTemporal,
    StylesEditorTemporalState,
    createStylesEditorStore,
} from '../stores/styles-editor-store';
import ThemeTabContent from './theme-tab-content';

// Context for the scoped editor store
const StylesEditorContext = createContext<StylesEditorStoreWithTemporal | null>(
    null,
);

export function useStylesEditor<T>(
    selector: (state: StylesEditorStore) => T,
): T {
    const store = useContext(StylesEditorContext);
    if (!store)
        throw new Error(
            'useStylesEditor must be used within CustomColorsModal',
        );
    return useStore(store, selector);
}

// Primitive: accepts a store directly
function useTemporalHistory(store: StylesEditorStoreWithTemporal) {
    const undo = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.undo,
    );
    const redo = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.redo,
    );
    const clear = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.clear,
    );
    const pause = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.pause,
    );
    const resume = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.resume,
    );
    const pastStates = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.pastStates,
    );
    const futureStates = useStoreWithEqualityFn(
        store.temporal,
        (s: StylesEditorTemporalState) => s.futureStates,
    );

    return {
        undo,
        redo,
        clear,
        pause,
        resume,
        canUndo: pastStates.length > 0,
        canRedo: futureStates.length > 0,
    };
}

// Context-based wrapper for child components (e.g. ThemeTabContent)
export function useStylesEditorHistory() {
    const store = useContext(StylesEditorContext);
    if (!store)
        throw new Error(
            'useStylesEditorHistory must be used within CustomColorsModal',
        );
    return useTemporalHistory(store);
}

interface Props {
    onClose?: () => void;
}

const CustomColorsModal = ({ onClose }: Props) => {
    const { resolvedTheme } = useTheme();
    const { styles: savedStyles } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(
        (resolvedTheme as 'light' | 'dark' | undefined) ?? 'dark',
    );

    // Create scoped store once, initialized from current query data
    const storeRef = useRef<StylesEditorStoreWithTemporal | null>(null);
    if (!storeRef.current) {
        storeRef.current = createStylesEditorStore(savedStyles);
        storeRef.current.temporal.getState().pause();
    }

    // Preview: editor styles as inline CSS vars (scoped to the preview card only)
    const editorStyles = useStore(storeRef.current, (s) => s.styles);
    const { root, dark } = stylesToReactStyles(editorStyles);

    const history = useTemporalHistory(storeRef.current);

    useEffect(() => {
        history.resume();

        return () => {
            history.pause();
            history.clear();
        };
    }, []);

    const handleResetToDefault = () => {
        storeRef.current!.getState().setStyles(savedStyles);
        history.clear();
    };

    const closeAndDiscardChanges = () => {
        onClose?.();
    };

    const saveChanges = () => {
        const finalStyles = storeRef.current!.getState().styles;
        update({ styles: finalStyles });
        onClose?.();
    };

    return (
        <StylesEditorContext.Provider value={storeRef.current}>
            <Fragment>
                <div className="-m-4 grid flex-1 grid-cols-1 gap-4 overflow-hidden overflow-y-scroll p-4 md:grid-cols-2">
                    <Tabs
                        defaultValue={resolvedTheme ?? 'dark'}
                        onValueChange={(v) =>
                            setActiveTheme(v as 'light' | 'dark')
                        }
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value="light">
                                <Sun className="size-4" /> Світла тема
                            </TabsTrigger>
                            <TabsTrigger value="dark">
                                <Moon className="size-4" /> Темна тема
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="light">
                            <ThemeTabContent theme="light" />
                        </TabsContent>
                        <TabsContent value="dark">
                            <ThemeTabContent theme="dark" />
                        </TabsContent>
                    </Tabs>

                    <Card
                        style={{
                            ...(activeTheme === 'light' ? root : dark),
                        }}
                        className="bg-background sticky top-4 h-fit gap-0 overflow-hidden p-0"
                    >
                        <div className="bg-muted/30 border-border flex w-full gap-4 border-b p-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                            </div>
                            <span className="text-muted-foreground text-xs">
                                Попередній перегляд
                            </span>
                        </div>
                        <div
                            className="flex flex-col gap-4 p-4"
                            style={{
                                backgroundImage:
                                    editorStyles?.[activeTheme]?.body
                                        ?.background_image,
                            }}
                        >
                            <div className="flex flex-wrap items-start gap-2">
                                <Button variant="default" size="md">
                                    Основна
                                </Button>
                                <Button variant="outline" size="md">
                                    Контурна
                                </Button>
                                <Button variant="secondary" size="md">
                                    Вторинна
                                </Button>
                                <Button
                                    variant="default"
                                    size="badge"
                                    className="shrink-0"
                                >
                                    Бейдж
                                </Button>
                            </div>
                            <Input placeholder="Введіть текст..." />
                            {/* Portal-less popover so it inherits the Card's inline CSS vars */}
                            <PopoverPrimitive.Root>
                                <PopoverPrimitive.Trigger asChild>
                                    <Button variant="outline" className="">
                                        Натисніть для спливаючого вікна
                                    </Button>
                                </PopoverPrimitive.Trigger>
                                <PopoverPrimitive.Content
                                    sideOffset={4}
                                    className="bg-popover text-popover-foreground ring-foreground/10 z-50 flex w-64 flex-col gap-2.5 rounded-lg p-3 text-sm shadow-md ring-1"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-popover-foreground text-sm font-medium">
                                            Спливаюче вікно
                                        </span>
                                        <span className="text-muted-foreground text-sm">
                                            Приклад тексту у спливаючому вікні
                                        </span>
                                    </div>
                                </PopoverPrimitive.Content>
                            </PopoverPrimitive.Root>
                            <div className="border-border bg-muted rounded-md border p-2">
                                <span className="text-muted-foreground text-sm">
                                    Приглушений блок з текстом
                                </span>
                            </div>
                            <p className="text-foreground text-sm leading-relaxed">
                                Талановиті брати{' '}
                                <span className="text-primary-foreground font-medium hover:cursor-pointer hover:underline">
                                    Елріки
                                </span>{' '}
                                порушили головну заборону алхімії.{' '}
                                <span className="text-muted-foreground">
                                    Це приглушений текст для прикладу.
                                </span>
                            </p>
                            <div className="border-border flex items-center gap-2 border-t pt-4">
                                <div className="bg-primary h-2 flex-1 rounded-full" />
                                <div className="bg-secondary h-2 flex-1 rounded-full" />
                                <div className="bg-muted h-2 flex-1 rounded-full" />
                            </div>
                        </div>
                    </Card>
                </div>

                <ResponsiveModalFooter>
                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon-md"
                                    onClick={() => history.undo()}
                                    disabled={!history.canUndo}
                                >
                                    <Undo2 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Скасувати</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon-md"
                                    onClick={() => history.redo()}
                                    disabled={!history.canRedo}
                                >
                                    <Redo2 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Повторити</TooltipContent>
                        </Tooltip>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            size="md"
                            onClick={handleResetToDefault}
                        >
                            Скинути зміни
                        </Button>
                    </div>
                    <div className="flex w-full items-center justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={closeAndDiscardChanges}
                            size="md"
                        >
                            Скасувати
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="default" size="md">
                                    Зберегти
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Зберегти зміни?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Ви впевнені, що хочете зберегти зміни
                                        кольорової палітри? Нові налаштування
                                        будуть застосовані до вашого профілю.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Скасувати
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={saveChanges}>
                                        Зберегти
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </ResponsiveModalFooter>
            </Fragment>
        </StylesEditorContext.Provider>
    );
};

export default CustomColorsModal;
