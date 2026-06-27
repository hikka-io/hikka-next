import { type FC, useCallback } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { type ArticleContentEnum, updateArticleMutation } from '@hikka/api';

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
import {
    hasPendingUploads,
    removeEmptyTextNodes,
    stripUploadPlaceholders,
} from '@/utils/plate';

type Props = {};

const EditActions: FC<Props> = () => {
    const slug = useArticleContext((state) => state.slug);
    const draft = useArticleContext((state) => state.draft);
    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const content = useArticleContext((state) => state.content);
    const getDocument = useArticleContext((state) => state.getDocument);
    const setArticle = useArticleContext((state) => state.setArticle);
    const queryClient = useQueryClient();

    const { mutate: mutateUpdateArticle, isPending } = useMutation({
        ...updateArticleMutation(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const id = (
                        query.queryKey[0] as { _id?: string } | undefined
                    )?._id;
                    return id === 'getArticles' || id === 'getArticle';
                },
            });

            toast.success('Ви успішно оновили статтю.');

            setArticle(data as unknown as Parameters<typeof setArticle>[0]);
        },
    });

    const handleUpdateArticle = useCallback(
        (draft: boolean = false) => {
            let document = getDocument();

            if (!document) {
                return;
            }

            if (hasPendingUploads(document)) {
                toast.error('Зачекайте завершення завантаження зображень.');
                return;
            }

            document = stripUploadPlaceholders(document);
            document = removeEmptyTextNodes(document);

            mutateUpdateArticle({
                path: { slug: slug! },
                body: {
                    document: document,
                    title: title || '',
                    tags,
                    draft,
                    category: category!,
                    content: content
                        ? {
                              slug: content.slug,
                              content_type:
                                  content.data_type as ArticleContentEnum,
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
                            to={`${CONTENT_TYPE_LINKS.article}/${slug}`}
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
