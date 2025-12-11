'use client';

import {
    ContentTypeEnum,
    ImportReadArgs,
    ImportWatchArgs,
    ReadContentType,
} from '@hikka/client';
import Link from 'next/link';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { xml2json } from 'xml-js';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';

import { cn } from '@/utils/cn';

import FoundList from './found-list';

interface Props {
    content_type: ReadContentType | ContentTypeEnum.ANIME;
    list: ImportReadArgs[] | ImportWatchArgs[];
    setList:
        | Dispatch<SetStateAction<ImportReadArgs[]>>
        | Dispatch<SetStateAction<ImportWatchArgs[]>>;
}

const Component = ({ list, setList, content_type }: Props) => {
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
                setList(
                    res.myanimelist[
                        content_type === ContentTypeEnum.ANIME
                            ? 'anime'
                            : 'manga'
                    ],
                );
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
                    className: cn(
                        'h-28 w-full p-4',
                        'flex items-center justify-center',
                        'bg-secondary/20 cursor-pointer rounded-lg border text-center',
                        'transition duration-100',
                        'hover:bg-secondary/20/90',
                        isDragActive && 'bg-secondary/20/90',
                    ),
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <P className="text-muted-foreground text-sm">
                        Перетягніть файл сюди...
                    </P>
                ) : list.length === 0 ? (
                    <P className="text-muted-foreground text-sm">
                        Перетягніть сюди <span>.XML</span> файл, або натисніть,
                        щоб завантажити
                    </P>
                ) : (
                    <FoundList list={list} type={content_type} />
                )}
            </div>
            <Small className="text-muted-foreground">
                <span>
                    Ви можете імпортувати свій список з{' '}
                    <Link
                        target="_blank"
                        href="https://myanimelist.net/panel.php?go=export"
                        className="text-primary-foreground hover:underline"
                    >
                        MyAnimeList
                    </Link>{' '}
                    або{' '}
                    <span className="text-primary-foreground">Shikimori</span>
                </span>
            </Small>
        </div>
    );
};

export default Component;
