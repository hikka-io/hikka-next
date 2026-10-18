import { use } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement, useSelected } from 'platejs/react';

import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';
import { cn } from '@/utils/cn';

import type { TImageElement } from '../editor/plate-types';
import { ImageGroupContext } from './image-group-context';
import { MediaActions } from './media-actions';
import { MEDIA_NODE } from './media-node';

export type ImageElementProps = PlateElementProps<TImageElement> & {
    className?: string;
};

/** Moves an image one place earlier or later in its group. */
function MoveButtons({
    editor,
    element,
}: Pick<ImageElementProps, 'editor' | 'element'>) {
    const group = use(ImageGroupContext);
    const index = group?.children.indexOf(element) ?? -1;
    const count = group?.children.length ?? 0;

    if (!group || index < 0 || count < 2) return null;

    const move = (offset: number) => {
        const groupPath = editor.api.findPath(group);
        if (!groupPath) return;

        editor.tf.moveNodes({
            at: [...groupPath, index],
            to: [...groupPath, index + offset],
        });
    };

    return (
        <>
            <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Перемістити раніше"
                disabled={index === 0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => move(-1)}
            >
                <ChevronLeft />
            </Button>
            <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Перемістити пізніше"
                disabled={index === count - 1}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => move(1)}
            >
                <ChevronRight />
            </Button>
        </>
    );
}

export function ImageElement({ className, ...props }: ImageElementProps) {
    const { children, element, editor } = props;
    const selected = useSelected();

    return (
        <PlateElement
            {...props}
            as="picture"
            className={cn(MEDIA_NODE, 'image-group-item relative', className)}
        >
            <div
                contentEditable={false}
                data-selected={selected}
                className="group/media relative size-full"
            >
                <Image
                    unoptimized
                    alt=""
                    src={element.url ?? ''}
                    // A native image drag duplicates its URL, which the backend rejects.
                    draggable={false}
                    className="image-item size-full object-cover"
                />
                <span className="pointer-events-none absolute inset-0 bg-primary-foreground/15 opacity-0 transition-opacity group-data-[selected=true]/media:opacity-100" />
                <MediaActions element={element}>
                    <MoveButtons editor={editor} element={element} />
                </MediaActions>
            </div>
            {children}
        </PlateElement>
    );
}
