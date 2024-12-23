'use client';

import { FC } from 'react';
import MaterialSymbolsDeleteForeverRounded from '~icons/material-symbols/delete-forever-rounded';

import { Button } from '@/components/ui/button';
import HorizontalCard from '@/components/ui/horizontal-card';
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

import SearchModal from '@/features/modals/search-modal/search-modal.component';

import useSession from '@/services/hooks/auth/use-session';
import { useArticleContext } from '@/services/providers/article-provider';
import {
    ARTICLE_CATEGORY_OPTIONS,
    CONTENT_TYPES,
} from '@/utils/constants/common';

import CreateActions from './create-actions';
import EditActions from './edit-actions';

interface Props {}

const ArticleSettings: FC<Props> = () => {
    const { isAdmin, isModerator } = useSession();

    const slug = useArticleContext((state) => state.slug);
    const title = useArticleContext((state) => state.title);
    const tags = useArticleContext((state) => state.tags);
    const category = useArticleContext((state) => state.category);
    const content = useArticleContext((state) => state.content);
    const setTitle = useArticleContext((state) => state.setTitle);
    const setTags = useArticleContext((state) => state.setTags);
    const setCategory = useArticleContext((state) => state.setCategory);
    const setContent = useArticleContext((state) => state.setContent);

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
                    <Label className="text-muted-foreground">Контент</Label>
                    {content && (
                        <HorizontalCard
                            title={
                                content.data_type === 'character' ||
                                content.data_type === 'person'
                                    ? content.name_ua || content.name_en
                                    : content.title ||
                                      content.title_ua ||
                                      content.title_en
                            }
                            titleClassName="line-clamp-2"
                            description={
                                CONTENT_TYPES[content.data_type].title_ua
                            }
                            image={content.image}
                            href={`/${content.data_type}/${content.slug}`}
                        >
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setContent(undefined)}
                            >
                                <MaterialSymbolsDeleteForeverRounded className="size-4" />
                            </Button>
                        </HorizontalCard>
                    )}
                    {!content && (
                        <SearchModal
                            allowedTypes={['anime', 'manga', 'novel']}
                            onClick={(value) =>
                                setContent(
                                    value as API.MainContent & {
                                        title?: string;
                                    },
                                )
                            }
                            type="button"
                        >
                            <Button variant="secondary">Додати контент</Button>
                        </SearchModal>
                    )}
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
                        disabled={!isAdmin() && !isModerator()}
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
                                                ? isAdmin() || isModerator()
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

export default ArticleSettings;
