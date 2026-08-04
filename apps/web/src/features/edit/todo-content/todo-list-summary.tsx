type Props = {
    total?: number;
    isLoading: boolean;
};

export function TodoListSummary(props: Props) {
    const { total, isLoading } = props;

    if (isLoading)
        return (
            <span className="inline-block h-4 w-40 animate-pulse rounded bg-secondary/40" />
        );

    return (
        <div className="flex min-h-6 flex-wrap items-center gap-x-4 gap-y-2">
            <div className="shrink-0 text-muted-foreground text-sm">
                Знайдено{' '}
                <span className="font-semibold text-foreground">
                    {(total ?? 0).toLocaleString('uk-UA')}
                </span>{' '}
                результатів
            </div>
        </div>
    );
}
