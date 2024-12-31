'use client';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { insertNodes, isUrl } from '@udecode/plate-common';
import { useEditorRef } from '@udecode/plate-common/react';
import {
    AudioPlugin,
    FilePlugin,
    ImagePlugin,
    VideoPlugin,
} from '@udecode/plate-media/react';
import { AudioLinesIcon, FileUpIcon, FilmIcon, ImageIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useOpenState } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { ToolbarButton } from './toolbar';

const MEDIA_CONFIG: Record<
    string,
    {
        accept: string[];
        icon: React.ReactNode;
        title: string;
        tooltip: string;
    }
> = {
    [AudioPlugin.key]: {
        accept: ['audio/*'],
        icon: <AudioLinesIcon className="size-4" />,
        title: 'Insert Audio',
        tooltip: 'Audio',
    },
    [FilePlugin.key]: {
        accept: ['*'],
        icon: <FileUpIcon className="size-4" />,
        title: 'Insert File',
        tooltip: 'File',
    },
    [ImagePlugin.key]: {
        accept: ['image/*'],
        icon: <ImageIcon className="size-4" />,
        title: 'Insert Image',
        tooltip: 'Image',
    },
    [VideoPlugin.key]: {
        accept: ['video/*'],
        icon: <FilmIcon className="size-4" />,
        title: 'Insert Video',
        tooltip: 'Video',
    },
};

export function MediaToolbarButton({
    children,
    nodeType,
    ...props
}: DropdownMenuProps & { nodeType: string }) {
    const currentConfig = MEDIA_CONFIG[nodeType];

    const openState = useOpenState();
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <ToolbarButton
                onClick={() => setDialogOpen(true)}
                pressed={openState.open}
            >
                {currentConfig.icon}
            </ToolbarButton>

            <AlertDialog
                open={dialogOpen}
                onOpenChange={(value) => {
                    setDialogOpen(value);
                }}
            >
                <AlertDialogContent className="gap-6">
                    <MediaUrlDialogContent
                        currentConfig={currentConfig}
                        nodeType={nodeType}
                        setOpen={setDialogOpen}
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function MediaUrlDialogContent({
    currentConfig,
    nodeType,
    setOpen,
}: {
    currentConfig: (typeof MEDIA_CONFIG)[string];
    nodeType: string;
    setOpen: (value: boolean) => void;
}) {
    const editor = useEditorRef();
    const [url, setUrl] = useState('');

    const embedMedia = useCallback(() => {
        if (!isUrl(url)) return console.error('Invalid URL');

        setOpen(false);
        insertNodes(editor, {
            children: [{ text: '' }],
            name:
                nodeType === FilePlugin.key ? url.split('/').pop() : undefined,
            type: nodeType,
            url,
        });
    }, [url, editor, nodeType, setOpen]);

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogDescription className="group relative w-full">
                <Input
                    id="url"
                    className="w-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') embedMedia();
                    }}
                    placeholder="URL"
                    type="url"
                    autoFocus
                />
            </AlertDialogDescription>

            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={(e) => {
                        e.preventDefault();
                        embedMedia();
                    }}
                >
                    Accept
                </AlertDialogAction>
            </AlertDialogFooter>
        </>
    );
}
