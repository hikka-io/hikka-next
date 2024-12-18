'use client';

import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { FC, memo, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import createArticle from '@/services/api/articles/createArticle';
import { useArticleStore } from '@/services/stores/article-store';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

interface Props {
    mode?: 'create' | 'edit';
}

const ArticleSettings: FC<Props> = ({ mode = 'create' }) => {
    const { enqueueSnackbar } = useSnackbar();

    const title = useArticleStore((state) => state.title);
    const tags = useArticleStore((state) => state.tags);
    const category = useArticleStore((state) => state.category);
    const setTitle = useArticleStore((state) => state.setTitle);
    const setTags = useArticleStore((state) => state.setTags);
    const setCategory = useArticleStore((state) => state.setCategory);
    const getText = useArticleStore((state) => state.getText);

    const { mutate: mutateCreateArticle, isPending } = useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            enqueueSnackbar('Ви успішно створили статтю.', {
                variant: 'success',
            });
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
                    category: category!,
                },
            });
        },
        [getText, title, tags, category, mutateCreateArticle],
    );

    return (
        <ScrollArea className="flex flex-col items-start gap-8 lg:max-h-[calc(100vh-6rem)]">
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">
                        Назва статті
                    </Label>
                    <Input
                        disabled={isPending}
                        placeholder="Введіть назву"
                        value={title || ''}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Label htmlFor="tags" className="text-muted-foreground">
                        Теги
                    </Label>
                    <InputTags
                        disabled={tags.length === 3 || isPending}
                        id="tags"
                        value={tags}
                        onChange={(tags) => setTags(tags as string[])}
                    />
                </div>

                {mode === 'create' && (
                    <div className="flex flex-col gap-4">
                        <Label
                            htmlFor="private"
                            className="text-muted-foreground"
                        >
                            Категорія
                        </Label>
                        <Select
                            disabled={isPending}
                            value={category ? [category] : category}
                            onValueChange={(value: API.ArticleCategory[]) =>
                                setCategory(value[0])
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {ARTICLE_CATEGORY_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Button
                        disabled={!title || isPending}
                        variant="secondary"
                        onClick={() => handleCreateArticle(true)}
                    >
                        У чернетку
                    </Button>

                    <Button
                        disabled={!title || isPending}
                        onClick={() => handleCreateArticle()}
                    >
                        Опублікувати
                    </Button>
                </div>
            </div>
        </ScrollArea>
    );
};

export default memo(ArticleSettings);
