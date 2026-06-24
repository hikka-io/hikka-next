import { RotateCw, TriangleAlert, X } from 'lucide-react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import { ImageGroupPlugin } from '../editor/plugins/image-group-kit';
import {
    ImagePlaceholderPlugin,
    type TImagePlaceholderElement,
} from '../editor/plugins/image-placeholder-kit';

export type ImagePlaceholderElementProps =
    PlateElementProps<TImagePlaceholderElement> & {
        className?: string;
    };

export function ImagePlaceholderElement({
    className,
    ...props
}: ImagePlaceholderElementProps) {
    const { children, element, editor } = props;
    const { id, previewUrl, status, progress, error } = element;

    const handleRemove = () =>
        editor.getTransforms(ImagePlaceholderPlugin).placeholder.remove({ id });

    const handleRetry = () =>
        editor.getTransforms(ImageGroupPlugin).imageGroup.retry({ id });

    return (
        <PlateElement
            {...props}
            className={cn(
                className,
                'relative size-28 overflow-hidden rounded-md bg-center bg-cover',
            )}
            style={{ backgroundImage: `url(${previewUrl})` }}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 p-2 text-center">
                {status === 'uploading' && (
                    <>
                        <Spinner />
                        <Progress value={progress} className="h-1 w-full" />
                        <Button
                            variant="secondary"
                            size="icon-sm"
                            className="absolute top-1 right-1"
                            onClick={handleRemove}
                        >
                            <X />
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <TriangleAlert className="size-5 text-destructive" />
                        <p className="line-clamp-2 text-background text-xs">
                            {error?.message ?? 'Помилка завантаження'}
                        </p>
                        <div className="flex gap-1">
                            <Button
                                variant="secondary"
                                size="icon-sm"
                                onClick={handleRetry}
                            >
                                <RotateCw />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon-sm"
                                onClick={handleRemove}
                            >
                                <X />
                            </Button>
                        </div>
                    </>
                )}
            </div>
            {children}
        </PlateElement>
    );
}
