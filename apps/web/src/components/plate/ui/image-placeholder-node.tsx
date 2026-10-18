import { RotateCw, TriangleAlert, X } from 'lucide-react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import type { TImagePlaceholderElement } from '../editor/plate-types';
import { ImageGroupPlugin } from '../editor/plugins/image-group-plugin';
import { ImagePlaceholderPlugin } from '../editor/plugins/image-placeholder-plugin';
import { isRetryableUploadError } from '../editor/upload-image';
import { MEDIA_NODE } from './media-node';

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
            as="picture"
            className={cn(MEDIA_NODE, 'image-group-item relative', className)}
        >
            <div contentEditable={false} className="relative size-full">
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt=""
                        draggable={false}
                        className="image-item size-full object-cover"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 p-3">
                    {status === 'uploading' ? (
                        <div className="flex w-full max-w-40 flex-col items-center gap-2">
                            <Spinner />
                            <Progress value={progress} className="h-1 w-full" />
                        </div>
                    ) : (
                        <Card
                            role="alert"
                            variant="glass"
                            className="max-w-64 items-center gap-3 p-3 text-center text-sm"
                        >
                            <TriangleAlert className="size-5 text-destructive-foreground" />
                            <p className="line-clamp-3">
                                {error?.message ?? 'Помилка завантаження'}
                            </p>
                            <div className="flex gap-2">
                                {isRetryableUploadError(error?.code) && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleRetry}
                                    >
                                        <RotateCw />
                                        Повторити
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleRemove}
                                >
                                    <X />
                                    Прибрати
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
                {status === 'uploading' && (
                    <Button
                        variant="secondary"
                        size="icon-sm"
                        aria-label="Скасувати завантаження"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X />
                    </Button>
                )}
            </div>
            {children}
        </PlateElement>
    );
}
