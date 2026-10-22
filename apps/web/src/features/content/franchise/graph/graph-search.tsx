import { type FC, Fragment } from 'react';

import { X } from 'lucide-react';

import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsSearchRounded from '@/components/icons/material-symbols/MaterialSymbolsSearchRounded';
import { Button } from '@/components/ui/button';
import { Command, CommandDialog, CommandInput } from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { SearchGroup, SearchItem, SearchList } from '@/features/search';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import {
    basicFacts,
    type FranchiseModel,
    type FranchiseNode,
    listStatus,
    relationText,
} from '../franchise-model';
import { RELATION_GROUP_STYLES } from '../relation-groups';
import GraphIconButton from './graph-icon-button';

const PLACEHOLDER = 'Пошук у франшизі...';
const PHONE_POPUP_CLASS =
    'inset-0 top-0 max-h-none max-w-none translate-x-0 rounded-none pt-[env(safe-area-inset-top,0px)] ring-0';

type Props = {
    model: FranchiseModel;
    isDesktop: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    query: string;
    onQueryChange: (query: string) => void;
    results: FranchiseNode[];
    onPick: (id: string) => void;
    onSearchSite: (query: string) => void;
    headerButtonClassName?: string;
};

type BodyProps = Omit<
    Props,
    'isDesktop' | 'open' | 'onOpenChange' | 'headerButtonClassName'
> & { closeButton?: boolean; onClose: () => void };

const ResultRow: FC<{ model: FranchiseModel; node: FranchiseNode }> = ({
    model,
    node,
}) => {
    const title = useTitle(node.content);
    const isCurrent = node === model.current;

    return (
        <div className="flex w-full items-center gap-4">
            <div className="w-12 shrink-0">
                <PosterCard
                    image={node.content.image}
                    imagePreset="cardXs"
                    containerClassName="rounded-(--base-radius)"
                    status={listStatus(node.content)}
                    statusSize="sm"
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label className="line-clamp-2 font-bold">{title}</Label>
                <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                    {basicFacts(node.content).map((fact) => (
                        <Fragment key={fact}>
                            <Label className="text-muted-foreground text-xs">
                                {fact}
                            </Label>
                            <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                        </Fragment>
                    ))}
                    <Label
                        className={cn(
                            'truncate text-xs',
                            RELATION_GROUP_STYLES[
                                isCurrent ? 'sequel' : node.group
                            ].text,
                        )}
                    >
                        {isCurrent ? 'Цей тайтл' : relationText(model, node)}
                    </Label>
                </div>
            </div>
        </div>
    );
};

const SearchBody: FC<BodyProps> = ({
    model,
    query,
    onQueryChange,
    results,
    onPick,
    onSearchSite,
    closeButton,
    onClose,
}) => (
    <>
        <CommandInput
            value={query}
            onValueChange={onQueryChange}
            placeholder={PLACEHOLDER}
            aria-label={PLACEHOLDER}
            autoFocus
            clearable
            containerClassName={cn(closeButton && 'pr-1')}
        >
            {closeButton ? (
                <Button
                    variant="ghost"
                    size="icon-md"
                    aria-label="Закрити пошук"
                    onClick={onClose}
                    className="shrink-0 text-muted-foreground"
                >
                    <X />
                </Button>
            ) : (
                <Kbd>Esc</Kbd>
            )}
        </CommandInput>
        {query.trim() &&
            (results.length ? (
                <SearchList className="md:max-h-[min(28rem,60dvh)]">
                    <SearchGroup>
                        {results.map((node) => (
                            <SearchItem
                                key={node.id}
                                value={node.id}
                                onSelect={() => onPick(node.id)}
                            >
                                <ResultRow model={model} node={node} />
                            </SearchItem>
                        ))}
                    </SearchGroup>
                </SearchList>
            ) : (
                <div className="flex flex-col items-center gap-3 px-4 py-6">
                    <span>Нічого не знайдено</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSearchSite(query)}
                    >
                        <MaterialSymbolsSearchRounded />
                        Шукати на сайті
                    </Button>
                </div>
            ))}
    </>
);

const GraphSearch: FC<Props> = ({
    isDesktop,
    open,
    onOpenChange,
    headerButtonClassName,
    ...body
}) => {
    const close = () => onOpenChange(false);

    if (!isDesktop) {
        return (
            <>
                <GraphIconButton
                    label="Знайти тайтл"
                    variant="ghost"
                    className={headerButtonClassName}
                    onClick={() => onOpenChange(true)}
                >
                    <MaterialSymbolsSearchRounded />
                </GraphIconButton>
                <CommandDialog
                    title="Пошук у франшизі"
                    description={PLACEHOLDER}
                    open={open}
                    onOpenChange={onOpenChange}
                    shouldFilter={false}
                    className={PHONE_POPUP_CLASS}
                >
                    <SearchBody {...body} closeButton onClose={close} />
                </CommandDialog>
            </>
        );
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className="lifted-edges w-58 shrink-0 justify-between font-normal text-muted-foreground"
                    />
                }
            >
                <span className="flex items-center gap-2">
                    <MaterialSymbolsSearchRounded />
                    {PLACEHOLDER}
                </span>
                <Kbd>Ctrl F</Kbd>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-115 gap-0 overflow-hidden p-0"
            >
                <Command shouldFilter={false} className="rounded-none!">
                    <SearchBody {...body} onClose={close} />
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default GraphSearch;
