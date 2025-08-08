'use client';

import { useCreateArticle } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

import MaterialSymbolsDraftRounded from '@/components/icons/material-symbols/MaterialSymbolsDraftRounded';
import MaterialSymbolsPublishRounded from '@/components/icons/material-symbols/MaterialSymbolsPublishRounded';
import { Button } from '@/components/ui/button';

import { useArticleContext } from '@/services/providers/article-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import removeEmptyTextNodes from '@/utils/remove-empty-text-nodes';

interface Props {}

const CreateActions: FC<Props> = () => {
    const router = useRouter();

    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const content = useArticleContext((state) => state.content);
    const getDocument = useArticleContext((state) => state.getDocument);
    const getPreview = useArticleContext((state) => state.getPreview);

    const {
        mutate: mutateCreateArticle,
        isPending,
        isSuccess,
    } = useCreateArticle({
        options: {
            onSuccess: (data) => {
                toast.success('Ви успішно створили статтю.');

                router.push(
                    `${CONTENT_TYPE_LINKS['article']}/${data.slug}/update`,
                );
            },
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
                disabled={!title || isPending || isSuccess}
                variant="secondary"
                onClick={() => handleCreateArticle(true)}
            >
                <MaterialSymbolsDraftRounded className="size-4" />У чернетку
            </Button>

            <Button
                disabled={!title || isPending || isSuccess}
                onClick={() => handleCreateArticle()}
            >
                <MaterialSymbolsPublishRounded className="size-4" />
                Опублікувати
            </Button>
        </div>
    );
};

export default CreateActions;
