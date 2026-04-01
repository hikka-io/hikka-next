'use client';

import { useUpdateArticle } from '@hikka/react';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';

import MaterialSymbolsPublishRounded from '@/components/icons/material-symbols/MaterialSymbolsPublishRounded';
import MaterialSymbolsRefreshRounded from '@/components/icons/material-symbols/MaterialSymbolsRefreshRounded';
import MaterialSymbolsVisibilityOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsVisibilityOutlineRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useArticleContext } from '@/services/providers/article-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';
import { removeEmptyTextNodes } from '@/utils/plate';

interface Props {}

const EditActions: FC<Props> = () => {
    const slug = useArticleContext((state) => state.slug);
    const draft = useArticleContext((state) => state.draft);
    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const content = useArticleContext((state) => state.content);
    const getDocument = useArticleContext((state) => state.getDocument);
    const setArticle = useArticleContext((state) => state.setArticle);

    const { mutate: mutateUpdateArticle, isPending } = useUpdateArticle({
        options: {
            onSuccess: (data) => {
                toast.success('Ви успішно оновили статтю.');

                setArticle(data);
            },
        },
    });

    const handleUpdateArticle = useCallback(
        (draft: boolean = false) => {
            let document = getDocument();

            if (!document) {
                return;
            }

            document = removeEmptyTextNodes(document);

            mutateUpdateArticle({
                slug: slug!,
                article: {
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
                },
            });
        },
        [getDocument, title, tags, category, content, mutateUpdateArticle],
    );

    return (
        <div className="flex gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button asChild variant="secondary" size="icon-md">
                        <Link
                            target="_blank"
                            to={`${CONTENT_TYPE_LINKS['article']}/${slug}`}
                        >
                            <MaterialSymbolsVisibilityOutlineRounded className="size-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Переглянути</TooltipContent>
            </Tooltip>

            {!draft && (
                <Button
                    className="flex-1"
                    size="md"
                    disabled={!title || isPending}
                    onClick={() => handleUpdateArticle()}
                >
                    <MaterialSymbolsRefreshRounded className="size-4" />
                    Оновити
                </Button>
            )}

            {draft && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon-md"
                            disabled={!title || isPending}
                            variant="secondary"
                            onClick={() => handleUpdateArticle(true)}
                        >
                            <MaterialSymbolsRefreshRounded className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Оновити чернетку</TooltipContent>
                </Tooltip>
            )}

            {draft && (
                <Button
                    size="md"
                    className="flex-1"
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
