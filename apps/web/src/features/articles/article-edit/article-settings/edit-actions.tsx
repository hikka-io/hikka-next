'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { FC, useCallback } from 'react';

import MaterialSymbolsPublishRounded from '../../../../components/icons/material-symbols/MaterialSymbolsPublishRounded';
import MaterialSymbolsRefreshRounded from '../../../../components/icons/material-symbols/MaterialSymbolsRefreshRounded';
import MaterialSymbolsVisibilityOutlineRounded from '../../../../components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Button } from '../../../../components/ui/button';
import updateArticle from '../../../../services/api/articles/updateArticle';
import { useArticleContext } from '../../../../services/providers/article-provider';
import { CONTENT_TYPE_LINKS } from '../../../../utils/constants/navigation';
import removeEmptyTextNodes from '../../../../utils/remove-empty-text-nodes';

interface Props {}

const EditActions: FC<Props> = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const slug = useArticleContext((state) => state.slug);
    const draft = useArticleContext((state) => state.draft);
    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const content = useArticleContext((state) => state.content);
    const getDocument = useArticleContext((state) => state.getDocument);
    const getPreview = useArticleContext((state) => state.getPreview);
    const setArticle = useArticleContext((state) => state.setArticle);

    const { mutate: mutateUpdateArticle, isPending } = useMutation({
        mutationFn: updateArticle,
        onSuccess: (data) => {
            enqueueSnackbar('Ви успішно оновили статтю.', {
                variant: 'success',
            });
            queryClient.invalidateQueries({
                queryKey: ['article', slug],
            });

            setArticle(data);
        },
    });

    const handleUpdateArticle = useCallback(
        (draft: boolean = false) => {
            let document = getDocument();
            let preview = getPreview();

            if (!document) {
                return;
            }

            document = removeEmptyTextNodes(document);
            preview = preview
                ? [
                      {
                          type: 'preview',
                          children: removeEmptyTextNodes(preview),
                      },
                  ]
                : [];

            mutateUpdateArticle({
                params: {
                    slug: slug!,
                    document: [...preview, ...document],
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
                },
            });
        },
        [
            getDocument,
            getPreview,
            title,
            tags,
            category,
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
                    <MaterialSymbolsVisibilityOutlineRounded className="size-4" />
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
