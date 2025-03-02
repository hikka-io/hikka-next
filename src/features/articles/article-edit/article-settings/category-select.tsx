'use client';

import { FC } from 'react';

import { Label } from '@/components/ui/label';
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

interface Props {}

const CategorySelect: FC<Props> = () => {
    const { isAdmin, isModerator } = useSession();

    const draft = useArticleContext((state) => state.draft);
    const category = useArticleContext((state) => state.category);
    const setCategory = useArticleContext((state) => state.setCategory);

    const filteredCategories = (
        Object.keys(ARTICLE_CATEGORY_OPTIONS) as Array<
            keyof typeof ARTICLE_CATEGORY_OPTIONS
        >
    ).filter((category) =>
        ARTICLE_CATEGORY_OPTIONS[category].admin
            ? isAdmin() || isModerator()
            : true,
    );

    return (
        <div className="flex flex-col gap-4">
            <Label htmlFor="private" className="text-muted-foreground">
                Категорія
            </Label>
            {!draft && category && (
                <Label>{ARTICLE_CATEGORY_OPTIONS[category].title_ua}</Label>
            )}
            {draft && (
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
                                {filteredCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {
                                            ARTICLE_CATEGORY_OPTIONS[category]
                                                .title_ua
                                        }
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};

export default CategorySelect;
