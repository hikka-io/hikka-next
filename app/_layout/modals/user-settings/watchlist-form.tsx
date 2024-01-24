'use client';

import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { xml2json } from 'xml-js';
import MaterialSymbolsCheckSmallRounded from '~icons/material-symbols/check-small-rounded';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Switch } from '@/app/_components/ui/switch';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/app/_components/ui/tabs';
import importAnilistWatch from '@/utils/api/settings/importAnilistWatch';
import importWatch from '@/utils/api/settings/importWatch';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';


const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [aniListLoading, setAniListLoading] = useState(false);
    const [aniListUsername, setAniListUsername] = useState('');
    const [tab, setTab] = useState<'general' | 'aniList'>('general');
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const [rewrite, setRewrite] = useState(true);
    const [watchList, setWatchList] = useState<Record<string, any>[]>([]);
    const [importing, setImporting] = useState<boolean>(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const nativeType = (value: string) => {
            let nValue = Number(value);
            if (!isNaN(nValue)) {
                return nValue;
            }
            let bValue = value.toLowerCase();
            if (bValue === 'true') {
                return true;
            } else if (bValue === 'false') {
                return false;
            }
            return value;
        };

        const removeJsonTextAttribute = (
            value: string,
            parentElement: Record<string, any>,
        ) => {
            try {
                let keyNo = Object.keys(parentElement._parent).length;
                let keyName = Object.keys(parentElement._parent)[keyNo - 1];
                parentElement._parent[keyName] = nativeType(value);
            } catch (e) {}
        };

        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = Array.from(acceptedFiles)[0];

            const text = await file.text();

            const res = JSON.parse(
                xml2json(text, {
                    compact: true,
                    trim: true,
                    ignoreDeclaration: true,
                    ignoreInstruction: true,
                    ignoreAttributes: true,
                    ignoreComment: true,
                    ignoreCdata: false,
                    ignoreDoctype: true,
                    cdataFn: removeJsonTextAttribute,
                    textFn: removeJsonTextAttribute,
                }),
            );

            if ('myanimelist' in res) {
                setWatchList(res.myanimelist.anime);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/xml': ['.xml'],
        },
    });

    const handleCompleteImport = async () => {
        setImporting(true);

        if (watchList && watchList.length > 0) {
            try {
                await importWatch({
                    overwrite: rewrite,
                    anime: watchList,
                    secret: String(secret),
                });

                enqueueSnackbar(
                    <span>
                        Ви успішно імпортували{' '}
                        <span className="font-bold">{watchList.length}</span>{' '}
                        аніме до Вашого списку.
                    </span>,
                    { variant: 'success' },
                );

                await queryClient.invalidateQueries();
                closeModal();
            } catch (e) {}
        }

        setImporting(false);
    };

    useEffect(() => {
        setWatchList([]);
    }, [tab]);

    const getFromAniList = async () => {
        setAniListLoading(true);
        try {
            const res = await importAnilistWatch({ username: aniListUsername });
            res.length > 0 && setWatchList(res);
        } catch (e) {
            enqueueSnackbar(
                'Не вдалось завантажити список даного користувача',
                { variant: 'error' },
            );
        }
        setAniListLoading(false);
    };

    const found = (
        <div>
            <p>
                У вашому списку знайдено{' '}
                <span className="rounded-sm bg-primary px-1 text-primary-foreground">
                    {watchList.length}
                </span>{' '}
                аніме, що готові до імпорту
            </p>
        </div>
    );

    const aniListImport = (
        <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2 w-full">
                <Label>Ім’я користувача AniList</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        className="flex-1"
                        placeholder="Введіть імʼя користувача"
                        onChange={(e) => setAniListUsername(e.target.value)}
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={getFromAniList}
                        disabled={
                            aniListUsername.length === 0 ||
                            aniListLoading ||
                            importing
                        }
                    >
                        {aniListLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <MaterialSymbolsCheckSmallRounded className="text-2xl" />
                        )}
                    </Button>
                </div>
            </div>
            {watchList.length > 0 && found}
        </div>
    );

    const generalImport = (
        <div className="flex flex-col gap-2 w-full">
            <Label>Файл списку</Label>
            <div
                {...getRootProps({
                    className: clsx(
                        'w-full h-28 p-4',
                        'flex justify-center items-center',
                        // 'border border-secondary',
                        'cursor-pointer bg-secondary/60 rounded-lg text-center',
                        'transition duration-100',
                        'hover:bg-secondary/90',
                        isDragActive && 'bg-secondary/90',
                    ),
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-muted-foreground text-sm">
                        Перетягніть файл сюди...
                    </p>
                ) : watchList.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        Перетягніть сюди <span>.XML</span> файл, або натисніть,
                        щоб завантажити
                    </p>
                ) : (
                    found
                )}
            </div>
            <Label className="text-xs text-muted-foreground">
                <span>
                    Ви можете імпортувати свій список з{' '}
                    <Link
                        target="_blank"
                        href="https://myanimelist.net/panel.php?go=export"
                        className="rounded-sm bg-primary px-1 text-primary-foreground hover:bg-primary/60 hover:!text-primary-foreground"
                    >
                        MyAnimeList
                    </Link>{' '}
                    або{' '}
                    <span className="rounded-sm bg-primary px-1 text-primary-foreground">
                        Shikimori
                    </span>
                </span>
            </Label>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center">
                <h3>Імпорт</h3>
            </div>

            <Tabs
                className="flex flex-col w-full gap-6"
                value={tab}
                onValueChange={(v) => setTab(v as 'general' | 'aniList')}
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">Загальний</TabsTrigger>
                    <TabsTrigger value="aniList">AniList</TabsTrigger>
                </TabsList>
                <TabsContent value="general">{generalImport}</TabsContent>
                <TabsContent value="aniList">{aniListImport}</TabsContent>
            </Tabs>

            <div className="flex items-center justify-between space-x-2 w-full">
                <Label htmlFor="rewrite">
                    Переписати аніме, які вже додані до списку
                </Label>
                <Switch
                    checked={rewrite}
                    onCheckedChange={(checked) => setRewrite(checked)}
                    id="rewrite"
                />
            </div>

            <div className="w-full">
                <Button
                    variant="accent"
                    onClick={handleCompleteImport}
                    disabled={watchList.length === 0}
                    type="submit"
                    className="w-full"
                >
                    {importing && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Імпортувати
                </Button>
            </div>
        </div>
    );
};

export default Component;