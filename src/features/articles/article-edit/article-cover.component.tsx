'use client';

import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useRef } from 'react';

import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import Image from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import uploadImage from '@/services/api/upload/uploadImage';
import { useArticleContext } from '@/services/providers/article-provider';

const ArticleCover = () => {
    const uploadCoverRef = useRef<HTMLInputElement>(null);
    const cover = useArticleContext((state) => state.cover);
    const setCover = useArticleContext((state) => state.setCover);

    const { mutate: mutateUploadImage, isPending } = useMutation({
        mutationFn: uploadImage,
        onSuccess: (data) => {
            setCover(data.url);

            console.log(data.url);
        },
    });

    const handleUploadImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = Array.from(e.target.files)[0];

            if (uploadCoverRef.current) {
                uploadCoverRef.current.value = '';
            }

            mutateUploadImage({
                params: {
                    file,
                    upload_type: 'attachment',
                },
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Обкладинка статті</Label>
                <P className="text-sm text-muted-foreground">
                    Рекомендований розмір обкладинки 768x208
                </P>
            </div>
            <div className="relative mb-4 flex h-52 w-full cursor-pointer">
                <Card className="flex-1 overflow-hidden bg-secondary/60 p-0 transition-opacity hover:opacity-60">
                    {cover ? (
                        <Image
                            alt="cover"
                            height={500}
                            width={300}
                            className="size-full rounded-md object-cover"
                            src={cover}
                        />
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <P className="text-sm text-muted-foreground">
                                Натисність, щоб завантажити обкладинку
                            </P>
                        </div>
                    )}

                    <Input
                        type="file"
                        id="cover-input"
                        onChange={handleUploadImageSelected}
                        ref={uploadCoverRef}
                        multiple={false}
                        className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                        accept="image/*"
                    />
                </Card>
            </div>
        </div>
    );
};

export default ArticleCover;
