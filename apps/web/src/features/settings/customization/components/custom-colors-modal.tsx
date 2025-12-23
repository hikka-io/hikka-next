'use client';

import { Moon, Redo2, Sun, Undo2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useModalContext } from '@/services/providers/modal-provider';
import {
    useUIStore,
    useUIStoreHistory,
} from '@/services/providers/ui-store-provider';
import { stylesToReactStyles } from '@/utils/appearance/inject-styles';

import ThemeTabContent from './theme-tab-content';

const CustomColorsModal = () => {
    const { resolvedTheme } = useTheme();

    const { closeModal } = useModalContext();
    const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(
        (resolvedTheme as 'light' | 'dark' | undefined) ?? 'dark',
    );

    const syncUserUI = useUIStore((state) => state.syncUserUI);
    const updateUserUI = useUIStore((state) => state.updateUserUI);

    const styles = useUIStore((state) => state.styles);
    const { root, dark } = stylesToReactStyles(styles);

    const { undo, redo, canUndo, canRedo, clear, pause, resume, isTracking } =
        useUIStoreHistory();

    useEffect(() => {
        resume();

        return () => {
            pause();
            clear();
        };
    }, [resume, pause, clear]);

    const handleResetToDefault = () => {
        syncUserUI().then(() => {
            clear();
        });
    };

    const closeAndDiscardChanges = () => {
        syncUserUI().then(() => {
            clear();
            closeModal();
        });
    };

    const saveChanges = () => {
        updateUserUI().then(() => {
            clear();
            closeModal();
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                styles?.[activeTheme]?.body?.background_image,
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
            <div className="flex flex-col md:flex-row justify-end gap-4 items-start md:items-center md:justify-between -mx-6 px-6 py-4 border-t sticky bottom-0 bg-background">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon-md"
                                onClick={() => undo()}
                                disabled={!canUndo}
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
                                onClick={() => redo()}
                                disabled={!canRedo}
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
            </div>
        </div>
    );
};

export default CustomColorsModal;
