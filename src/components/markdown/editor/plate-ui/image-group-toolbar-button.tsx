'use client';

import { insertNodes } from '@udecode/plate-common';
import { useEditorRef } from '@udecode/plate-common/react';
import { ImageIcon } from 'lucide-react';
import { useCallback } from 'react';

import { Input } from '@/components/ui/input';

import {
    ImageGroupPlugin,
    ImagePlugin,
} from '../plugins/image-group-plugin/image-group-plugin';
import { ToolbarButton } from './toolbar';

export function ImageGroupToolbarButton() {
    const editor = useEditorRef();

    const insertMedia = useCallback(
        ({ files: filelist }: { files: FileList | null }) => {
            if (!filelist) return;

            const files = Array.from(filelist).slice(0, 4);
            const urls: string[] = [];

            files.forEach((file) => {
                const fileURL = URL.createObjectURL(file);
                urls.push(fileURL);
            });

            insertNodes(
                editor,
                {
                    type: ImageGroupPlugin.key,
                    children: urls.map((url) => ({
                        type: ImagePlugin.key,
                        children: [{ text: '' }],
                        url,
                    })),
                },
                {
                    at: [editor.children.length],
                },
            );
        },
        [editor],
    );

    return (
        <ToolbarButton className="relative">
            <Input
                type="file"
                id="avatar-input"
                onChange={(e) => insertMedia({ files: e.target.files })}
                multiple
                max={4}
                className="absolute left-0 top-0 size-full opacity-0 cursor-pointer"
                accept="image/*"
            />
            <ImageIcon className="size-4" />
        </ToolbarButton>
    );
}
