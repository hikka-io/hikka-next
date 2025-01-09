'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { FC, useCallback } from 'react';

import MaterialSymbolsPublishRounded from '@/components/icons/material-symbols/MaterialSymbolsPublishRounded';
import MaterialSymbolsRefreshRounded from '@/components/icons/material-symbols/MaterialSymbolsRefreshRounded';
import MaterialSymbolsVisibilityOutline from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutline';
import { Button } from '@/components/ui/button';

import updateArticle from '@/services/api/articles/updateArticle';
import { useArticleContext } from '@/services/providers/article-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {}

const EditActions: FC<Props> = () => {
    const { enqueueSnackbar } = useSnackbar();

    const slug = useArticleContext((state) => state.slug);
    const draft = useArticleContext((state) => state.draft);
    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const cover = useArticleContext((state) => state.cover);
    const content = useArticleContext((state) => state.content);
    const getDocument = useArticleContext((state) => state.getDocument);
    const setArticle = useArticleContext((state) => state.setArticle);

    const { mutate: mutateUpdateArticle, isPending } = useMutation({
        mutationFn: updateArticle,
        onSuccess: (data) => {
            enqueueSnackbar('Ви успішно оновили статтю.', {
                variant: 'success',
            });

            setArticle(data);
        },
    });

    const handleUpdateArticle = useCallback(
        (draft: boolean = false) => {
            const document = getDocument();

            if (!document) {
                return;
            }

            mutateUpdateArticle({
                params: {
                    slug: slug!,
                    document: document,
                    title: title || '',
                    tags,
                    draft,
                    category: category!,
                    content: content
                        ? {
                              slug: content.slug,
                              content_type: content.data_type,
                          }
                        : undefined,
                    cover: cover,
                },
            });
        },
        [
            getDocument,
            title,
            tags,
            category,
            cover,
            content,
            mutateUpdateArticle,
        ],
    );

    return (
        <div className="flex flex-col gap-4">
            <Button asChild variant="secondary">
                <Link
                    target="_blank"
                    href={`${CONTENT_TYPE_LINKS['article']}/${slug}`}
                >
                    <MaterialSymbolsVisibilityOutline className="size-4" />
                    Переглянути
                </Link>
            </Button>

            {!draft && (
                <Button
                    disabled={!title || isPending}
                    onClick={() => handleUpdateArticle()}
                >
                    <MaterialSymbolsRefreshRounded className="size-4" />
                    Оновити
                </Button>
            )}

            {draft && (
                <Button
                    disabled={!title || isPending}
                    variant="secondary"
                    onClick={() => handleUpdateArticle(true)}
                >
                    <MaterialSymbolsRefreshRounded className="size-4" />
                    Оновити чернетку
                </Button>
            )}

            {draft && (
                <Button
                    disabled={!title || isPending}
                    onClick={() => handleUpdateArticle()}
                >
                    <MaterialSymbolsPublishRounded className="size-4" />
                    Опублікувати
                </Button>
            )}
        </div>
    );
};

export default EditActions;
