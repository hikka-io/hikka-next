'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { xml2json } from 'xml-js';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';

import FoundList from '@/features/modals/user-settings-modal/readlist-form/found-list';

interface Props {
    readList: Record<string, any>[];
    setReadList: Dispatch<SetStateAction<Record<string, any>[]>>;
}

const Component = ({ readList, setReadList }: Props) => {
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

                if (keyName === 'my_comments') {
                    parentElement._parent[keyName] = String(value);
                } else {
                    parentElement._parent[keyName] = nativeType(value);
                }
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
                setReadList(res.myanimelist.manga);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/xml': ['.xml'],
        },
    });

    return (
        <div className="flex w-full flex-col gap-2">
            <Label>Файл списку</Label>
            <div
                {...getRootProps({
                    className: clsx(
                        'w-full h-28 p-4',
                        'flex justify-center items-center',
                        'cursor-pointer bg-secondary/60 rounded-lg text-center',
                        'transition duration-100',
                        'hover:bg-secondary/90',
                        isDragActive && 'bg-secondary/90',
                    ),
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <P className="text-sm text-muted-foreground">
                        Перетягніть файл сюди...
                    </P>
                ) : readList.length === 0 ? (
                    <P className="text-sm text-muted-foreground">
                        Перетягніть сюди <span>.XML</span> файл, або натисніть,
                        щоб завантажити
                    </P>
                ) : (
                    <FoundList readList={readList} />
                )}
            </div>
            <Small className="text-muted-foreground">
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
            </Small>
        </div>
    );
};

export default Component;
