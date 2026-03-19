'use client';

import { Moon, Redo2, Sun, Undo2 } from 'lucide-react';
import { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { setStylesEditing } from '@/features/common/ui-styles-syncer';
import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';
import { useTheme } from '@/services/providers/theme-provider';
import { applyStyles, stylesToReactStyles } from '@/utils/ui/inject-styles';

import {
    StylesEditorStore,
    StylesEditorStoreWithTemporal,
    StylesEditorTemporalState,
    createStylesEditorStore,
} from '../stores/styles-editor-store';

import ThemeTabContent from './theme-tab-content';

// Context for the scoped editor store
const StylesEditorContext = createContext<StylesEditorStoreWithTemporal | null>(null);

export function useStylesEditor<T>(selector: (state: StylesEditorStore) => T): T {
    const store = useContext(StylesEditorContext);
    if (!store) throw new Error('useStylesEditor must be used within CustomColorsModal');
    return useStore(store, selector);
}

// Primitive: accepts a store directly
function useTemporalHistory(store: StylesEditorStoreWithTemporal) {
    const undo = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.undo);
    const redo = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.redo);
    const clear = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.clear);
    const pause = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.pause);
    const resume = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.resume);
    const pastStates = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.pastStates);
    const futureStates = useStoreWithEqualityFn(store.temporal, (s: StylesEditorTemporalState) => s.futureStates);

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
    if (!store) throw new Error('useStylesEditorHistory must be used within CustomColorsModal');
    return useTemporalHistory(store);
}

interface Props {
    onClose?: () => void;
}

const CustomColorsModal = ({ onClose }: Props) => {
    const { resolvedTheme } = useTheme();
    const { styles: savedStyles, mergedStyles: savedMergedStyles } = useSessionUI();
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

    // Track latest savedMergedStyles so cleanup always restores the current value
    const savedMergedStylesRef = useRef(savedMergedStyles);
    useEffect(() => {
        savedMergedStylesRef.current = savedMergedStyles;
    }, [savedMergedStyles]);

    // Take over CSS injection from global UIStylesSyncer
    useEffect(() => {
        setStylesEditing(true);

        return () => {
            setStylesEditing(false);
            applyStyles(savedMergedStylesRef.current);
        };
    }, []);

    // Live preview: apply editor styles on every change
    const editorStyles = useStore(storeRef.current, (s) => s.styles);
    useEffect(() => {
        const merged = storeRef.current!.getState().getMergedStyles();
        applyStyles(merged);
    }, [editorStyles]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden overflow-y-scroll -m-4 p-4">
                    <Tabs
                        defaultValue={resolvedTheme ?? 'dark'}
                        onValueChange={(v) => setActiveTheme(v as 'light' | 'dark')}
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
                        className="p-0 gap-0 overflow-hidden bg-background h-fit top-4 sticky"
                    >
                        <div className="border-b p-3 flex gap-4 w-full bg-muted/30">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Попередній перегляд
                            </span>
                        </div>
                        <div
                            className="p-4 flex flex-col gap-4"
                            style={{
                                backgroundImage:
                                    editorStyles?.[activeTheme]?.body?.background_image,
                            }}
                        >
                            <div className="flex gap-2 flex-wrap items-start">
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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="">
                                        Натисніть для спливаючого вікна
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-popover-foreground">
                                            Спливаюче вікно
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            Приклад тексту у спливаючому вікні
                                        </span>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="rounded-md border bg-muted p-2">
                                <span className="text-sm text-muted-foreground">
                                    Приглушений блок з текстом
                                </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                                Талановиті брати{' '}
                                <span className="text-primary-foreground font-medium hover:underline hover:cursor-pointer">
                                    Елріки
                                </span>{' '}
                                порушили головну заборону алхімії.{' '}
                                <span className="text-muted-foreground">
                                    Це приглушений текст для прикладу.
                                </span>
                            </p>
                            <div className="flex items-center gap-2 pt-4 border-t">
                                <div className="flex-1 h-2 rounded-full bg-primary" />
                                <div className="flex-1 h-2 rounded-full bg-secondary" />
                                <div className="flex-1 h-2 rounded-full bg-muted" />
                            </div>
                        </div>
                    </Card>
                </div>

                <ResponsiveModalFooter>
                    <div className="flex items-center gap-2 w-full md:w-auto">
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
                    <div className="flex gap-2 items-center w-full justify-end">
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
                                        кольорової палітри? Нові налаштування будуть
                                        застосовані до вашого профілю.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
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
