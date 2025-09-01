'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils/utils';

export interface ImageElementProps extends PlateElementProps {
    className?: string;
    url?: string;
}

export function ImageElement({ className, ...props }: ImageElementProps) {
    const { children, element, editor } = props;
    const url = (element as any)?.url || props.url || '';

    const handleDeleteMediaItem = () => {
        editor.tf.removeNodes({
            at: editor.api.findPath(element),
        });
    };

    return (
        <PlateElement
            {...props}
            className={cn(
                className,
                'relative size-28 cursor-pointer rounded-md bg-cover bg-center',
            )}
            style={{
                backgroundImage: `url(${url})`,
            }}
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
            {children}
        </PlateElement>
    );
}
