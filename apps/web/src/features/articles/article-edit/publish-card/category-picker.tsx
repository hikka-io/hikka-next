import { type FC, useId } from 'react';

import { LockIcon, SquareLibrary } from 'lucide-react';

import { ArticleCategoryEnum } from '@hikka/api';
import { ARTICLE_CATEGORY } from '@hikka/core';

import { ARTICLE_CATEGORY_ICONS } from '@/components/icons/article-category-icons';
import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSession } from '@/services/session';
import { cn } from '@/utils/cn';

import { useArticleContext } from '../article-provider';

const CATEGORY_HINTS: Record<ArticleCategoryEnum, string> = {
    [ArticleCategoryEnum.NEWS]: 'Анонси, трейлери, дати виходу',
    [ArticleCategoryEnum.REVIEWS]: 'Ваша думка про конкретний тайтл',
    [ArticleCategoryEnum.ORIGINAL]: 'Есеї, добірки, аналітика',
    [ArticleCategoryEnum.SYSTEM]: 'Оголошення команди Hikka',
};

type CategoryIconProps = {
    category: ArticleCategoryEnum;
    className?: string;
};

const CategoryIcon: FC<CategoryIconProps> = ({ category, className }) => {
    const Icon = ARTICLE_CATEGORY_ICONS[category] ?? MaterialSymbolsInfoRounded;

    return (
        <span
            className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground',
                className,
            )}
        >
            <Icon className="size-4" />
        </span>
    );
};

const CategoryPicker: FC = () => {
    const { isAdmin, isModerator } = useSession();
    const draft = useArticleContext((state) => state.draft);
    const category = useArticleContext((state) => state.category);
    const setCategory = useArticleContext((state) => state.setCategory);
    // Rendered twice on phones (the hidden card and the drawer), so ids must be unique.
    const id = useId();
    const labelId = `${id}-label`;

    const categories = (
        Object.keys(ARTICLE_CATEGORY) as ArticleCategoryEnum[]
    ).filter(
        (key) => !ARTICLE_CATEGORY[key].admin || isAdmin() || isModerator(),
    );

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
                <SquareLibrary className="size-4 shrink-0" />
                <Label id={labelId}>Категорія</Label>
            </div>

            {draft ? (
                <RadioGroup
                    aria-labelledby={labelId}
                    value={category}
                    onValueChange={(value) =>
                        setCategory(value as ArticleCategoryEnum)
                    }
                >
                    {categories.map((key) => (
                        <FieldLabel key={key} htmlFor={`${id}-${key}`}>
                            <Field orientation="horizontal" className="gap-3">
                                <CategoryIcon
                                    category={key}
                                    className="group-has-data-checked/field-label:bg-primary-foreground/15 group-has-data-checked/field-label:text-primary-foreground"
                                />
                                <FieldContent>
                                    <FieldTitle>
                                        {ARTICLE_CATEGORY[key].title_ua}
                                    </FieldTitle>
                                    <FieldDescription className="text-xs">
                                        {CATEGORY_HINTS[key]}
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem
                                    value={key}
                                    id={`${id}-${key}`}
                                />
                            </Field>
                        </FieldLabel>
                    ))}
                </RadioGroup>
            ) : (
                <div className="flex items-center gap-3 rounded-lg border p-2.5">
                    <CategoryIcon
                        category={category}
                        className="bg-primary-foreground/15 text-primary-foreground"
                    />
                    <div className="flex flex-1 flex-col gap-0.5 leading-snug">
                        <span className="font-medium text-sm">
                            {ARTICLE_CATEGORY[category].title_ua}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            Не змінюється після публікації
                        </span>
                    </div>
                    <LockIcon className="size-4 shrink-0 text-muted-foreground" />
                </div>
            )}
        </div>
    );
};

export default CategoryPicker;
