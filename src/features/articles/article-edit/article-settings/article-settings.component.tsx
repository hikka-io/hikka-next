'use client';

import { FC, memo } from 'react';

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

import useSession from '@/services/hooks/auth/use-session';
import { useArticleContext } from '@/services/providers/article-provider';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import CreateActions from './create-actions';
import EditActions from './edit-actions';

interface Props {}

const ArticleSettings: FC<Props> = () => {
    const { user: loggedUser } = useSession();

    const slug = useArticleContext((state) => state.slug);
    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const setTitle = useArticleContext((state) => state.setTitle);
    const setTags = useArticleContext((state) => state.setTags);
    const setCategory = useArticleContext((state) => state.setCategory);

    return (
        <ScrollArea className="flex flex-col items-start gap-8 lg:max-h-[calc(100vh-6rem)]">
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex flex-col gap-4">
                    <Label className="text-muted-foreground">
                        Назва статті
                    </Label>
                    <Input
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
                        disabled={tags.length === 3}
                        id="tags"
                        value={tags}
                        onChange={(tags) => setTags(tags as string[])}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Label htmlFor="private" className="text-muted-foreground">
                        Категорія
                    </Label>
                    <Select
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
                                    {ARTICLE_CATEGORY_OPTIONS.filter(
                                        (option) =>
                                            option.admin
                                                ? loggedUser?.role ===
                                                      'admin' ||
                                                  loggedUser?.role ===
                                                      'moderator'
                                                : true,
                                    ).map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectList>
                        </SelectContent>
                    </Select>
                </div>

                {!slug && <CreateActions />}
                {slug && <EditActions />}
            </div>
        </ScrollArea>
    );
};

export default memo(ArticleSettings);
