import { type FC, useEffect, useRef, useState } from 'react';

import type { QueryKey } from '@tanstack/react-query';
import { Check, ChevronLeft } from 'lucide-react';

import type { CollectionResponse } from '@hikka/api';

import BlockBleed from '@/components/ui/block-bleed';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import { COLLECTION_MIN_ENTRIES } from './constants';
import { useUpdateCollectionEntry } from './use-update-collection-entry';

type Props = {
    collection: CollectionResponse;
    slug: string;
    member: boolean;
    membershipKey: QueryKey;
    onBack: () => void;
};

function panelTitle(member: boolean, grouped: boolean) {
    if (member) return 'Уже в колекції';
    return grouped ? 'Оберіть групу' : 'Додати до колекції';
}

const CollectionEntryPanel: FC<Props> = ({
    collection,
    slug,
    member,
    membershipKey,
    onBack,
}) => {
    const [group, setGroup] = useState<string>();
    const backRef = useRef<HTMLButtonElement>(null);
    const { mutate, isPending } = useUpdateCollectionEntry(
        collection.reference,
        slug,
        membershipKey,
    );

    const grouped = collection.labels_order.length > 0;
    const last = member && collection.entries <= COLLECTION_MIN_ENTRIES;

    useEffect(() => {
        backRef.current?.focus();
    }, []);

    const submit = () =>
        mutate({ add: !member, label: group }, { onSuccess: onBack });

    return (
        <div className="flex flex-col gap-3">
            <div className="-ml-2 flex items-center gap-1">
                <Button
                    ref={backRef}
                    variant="ghost"
                    size="icon-md"
                    className="[&_svg]:size-6"
                    aria-label="Назад"
                    disabled={isPending}
                    onClick={onBack}
                >
                    <ChevronLeft />
                </Button>
                <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="truncate font-semibold text-sm">
                        {panelTitle(member, grouped)}
                    </h2>
                    <span className="truncate text-muted-foreground text-xs">
                        {collection.title}
                    </span>
                </div>
            </div>

            {!member && grouped && (
                <BlockBleed className="max-h-80 overflow-y-auto">
                    {collection.labels_order.map((label) => {
                        const selected = label === group;

                        return (
                            <button
                                key={label}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setGroup(label)}
                                className={cn(
                                    '-mt-px flex w-full cursor-pointer items-center gap-3 border-transparent border-y px-4 py-2.5 text-left text-sm transition-colors duration-100 first:mt-0 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
                                    selected &&
                                        'relative border-primary-border bg-primary font-medium text-primary-foreground hover:bg-primary-border',
                                )}
                            >
                                <span className="min-w-0 flex-1 truncate">
                                    {label}
                                </span>
                                <Check
                                    className={cn(
                                        'size-4 shrink-0',
                                        !selected && 'invisible',
                                    )}
                                />
                            </button>
                        );
                    })}
                </BlockBleed>
            )}

            {!member && !grouped && (
                <p className="text-muted-foreground text-sm">
                    Запис буде додано в кінець колекції.
                </p>
            )}

            {member && (
                <p className="text-muted-foreground text-sm">
                    Запис уже є в цій колекції.
                </p>
            )}

            {last && (
                <p className="text-warning-foreground text-xs">
                    Це остання позиція: колекція не може бути порожньою.
                </p>
            )}

            <BlockBleed className="flex-row justify-end gap-2 border-t px-4 pt-3">
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={onBack}
                >
                    Скасувати
                </Button>
                <Button
                    variant={member ? 'destructive' : 'default'}
                    size="sm"
                    disabled={
                        isPending || last || (!member && grouped && !group)
                    }
                    onClick={submit}
                >
                    {isPending && <Spinner size="sm" />}
                    {member ? 'Прибрати' : 'Додати'}
                </Button>
            </BlockBleed>
        </div>
    );
};

export default CollectionEntryPanel;
