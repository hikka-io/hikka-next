'use client';

import { cn, withRef } from '@udecode/cn';
import { useElement } from '@udecode/plate/react';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import { Button } from '@/components/ui/button';

import { ImageItemElement } from '../plugins/image-group-plugin/image-group-plugin';
import { PlateElement } from './plate-element';

export const ImageElement = withRef<typeof PlateElement>(
    ({ className, editor, ...props }, ref) => {
        const element = useElement<ImageItemElement>();

        const handleDeleteMediaItem = () => {
            editor.tf.removeNodes({
                at: editor.api.findPath(element),
            });
        };

        return (
            <PlateElement
                editor={editor}
                {...props}
                className={cn(
                    className,
                    'relative size-28 cursor-pointer rounded-md bg-cover bg-center',
                )}
                style={{
                    backgroundImage: `url(${element.url})`,
                }}
                ref={ref}
                contentEditable={false}
            >
                <div className="absolute bottom-0 left-0 flex w-full justify-end p-2">
                    <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={handleDeleteMediaItem}
                    >
                        <MaterialSymbolsDeleteForever />
                    </Button>
                </div>
            </PlateElement>
        );
    },
);
