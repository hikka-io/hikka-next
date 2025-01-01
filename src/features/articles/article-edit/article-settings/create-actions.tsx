'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FC, useCallback } from 'react';

import MaterialSymbolsDraftRounded from '@/components/icons/material-symbols/MaterialSymbolsDraftRounded';
import MaterialSymbolsPublishRounded from '@/components/icons/material-symbols/MaterialSymbolsPublishRounded';
import { Button } from '@/components/ui/button';

import createArticle from '@/services/api/articles/createArticle';
import { useArticleContext } from '@/services/providers/article-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {}

const CreateActions: FC<Props> = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const cover = useArticleContext((state) => state.cover);
    const content = useArticleContext((state) => state.content);
    const getText = useArticleContext((state) => state.getText);

    const { mutate: mutateCreateArticle, isPending } = useMutation({
        mutationFn: createArticle,
        onSuccess: (data) => {
            enqueueSnackbar('Ви успішно створили статтю.', {
                variant: 'success',
            });

            router.push(`${CONTENT_TYPE_LINKS['article']}/${data.slug}/update`);
        },
    });

    const handleCreateArticle = useCallback(
        (draft: boolean = false) => {
            const text = getText();

            if (!text) {
                return;
            }

            mutateCreateArticle({
                params: {
                    text: text || '',
                    title: title || '',
                    tags,
                    draft,
                    cover,
                    content: content
                        ? {
                              slug: content.slug,
                              content_type: content.data_type,
                          }
                        : undefined,
                    category: category!,
                },
            });
        },
        [getText, title, tags, category, content, cover, mutateCreateArticle],
    );

    return (
        <div className="flex flex-col gap-4">
            <Button
                disabled={!title || isPending}
                variant="secondary"
                onClick={() => handleCreateArticle(true)}
            >
                <MaterialSymbolsDraftRounded className="size-4" />У чернетку
            </Button>

            <Button
                disabled={!title || isPending}
                onClick={() => handleCreateArticle()}
            >
                <MaterialSymbolsPublishRounded className="size-4" />
                Опублікувати
            </Button>
        </div>
    );
};

export default CreateActions;
