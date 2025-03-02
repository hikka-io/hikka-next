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
import removeEmptyTextNodes from '@/utils/remove-empty-text-nodes';

interface Props {}

const CreateActions: FC<Props> = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const content = useArticleContext((state) => state.content);
    const getDocument = useArticleContext((state) => state.getDocument);
    const getPreview = useArticleContext((state) => state.getPreview);

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

            mutateCreateArticle({
                params: {
                    document: [...preview, ...document],
                    title: title || '',
                    tags,
                    draft,
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
        [
            getDocument,
            getPreview,
            title,
            tags,
            category,
            content,
            mutateCreateArticle,
        ],
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
