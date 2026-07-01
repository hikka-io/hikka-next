import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import { toast } from 'sonner';

import {
    type AuthTokenInfoResponse,
    revokeTokenMutation,
    thirdPartyAuthTokensInfiniteOptions,
} from '@hikka/api';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LucideChevronsUpDown } from 'lucide-react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsVerifiedRounded from '@/components/icons/material-symbols/MaterialSymbolsVerifiedRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
    appName: string;
    appDescription?: string | null;
    verified?: boolean;
    tokens: AuthTokenInfoResponse[];
};

// Declared as a standalone component at module level to adhere to React Rules of Hooks
const AuthorizedAppItem: FC<{ token: AuthTokenInfoResponse }> = ({ token }) => {
    const queryClient = useQueryClient();

    const { mutate: revokeToken, isPending: isRevoking } = useMutation({
        ...revokeTokenMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: thirdPartyAuthTokensInfiniteOptions().queryKey,
            });
            toast.success('Доступ успішно відкликано.');
        },
        onError: () => {
            toast.error('Не вдалося відкликати доступ. Спробуйте ще раз.');
        },
    });

    const handleRevoke = () => {
        revokeToken({ path: { token_reference: token.reference } });
    };

    return (
        <div className="flex items-center justify-between gap-4 border-border border-t py-3 first:border-t-0 first:pt-0 last:pb-0">
            <div className="flex flex-col">
                <p className="text-sm">
                    {token.created
                        ? format(
                              new Date(token.created * 1000),
                              'd MMMM yyyy, HH:mm',
                          )
                        : 'Дата невідома'}
                </p>
                <p className="text-muted-foreground text-xs opacity-60">
                    {token.reference}
                </p>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        className="shrink-0"
                        variant="outline"
                        size="icon-sm"
                        disabled={isRevoking}
                    >
                        {isRevoking ? (
                            <Spinner />
                        ) : (
                            <MaterialSymbolsDeleteForeverRounded className="size-4" />
                        )}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Відкликати цей доступ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Цей сеанс авторизації буде завершено, і
                            застосунку знадобиться повторна авторизація.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Відмінити</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRevoke}>
                            Підтвердити
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const AuthorizedAppGroup: FC<Props> = ({
    appName,
    appDescription,
    verified,
    tokens,
}) => {
    const queryClient = useQueryClient();

    const { mutate: revokeAll, isPending: isRevokingAll } = useMutation({
        mutationFn: async () => {
            const { mutationFn } = revokeTokenMutation();
            if (!mutationFn) return;

            // Revoke all tokens associated with this application concurrently
            await Promise.all(
                tokens.map((token) =>
                    mutationFn(
                        { path: { token_reference: token.reference } },
                        undefined as any,
                    ),
                ),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: thirdPartyAuthTokensInfiniteOptions().queryKey,
            });
            toast.success('Усі сеанси доступу успішно відкликано.');
        },
        onError: () => {
            toast.error('Не вдалося відкликати всі сеанси. Спробуйте ще раз.');
        },
    });

    return (
        <Card className="flex-col gap-4">
            <Collapsible defaultOpen={tokens.length === 1}>
                <CollapsibleTrigger asChild>
                    <div className="flex cursor-pointer items-center justify-between gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <h5 className="line-clamp-1">{appName}</h5>
                                {verified && (
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <div className="rounded-sm border border-border bg-secondary/20 p-1 backdrop-blur">
                                                <MaterialSymbolsVerifiedRounded className="text-primary-foreground" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <Label className="text-sm">
                                                Верифіковано
                                            </Label>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                {tokens.length > 1 && (
                                    <span className="rounded-sm border border-border bg-secondary/20 px-1.5 py-0.5 text-muted-foreground text-xs">
                                        {tokens.length} сеанси
                                    </span>
                                )}
                            </div>
                            {appDescription && (
                                <p className="line-clamp-2 text-muted-foreground text-sm">
                                    {appDescription}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className="shrink-0"
                                        variant="destructive"
                                        size="md"
                                        disabled={isRevokingAll}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        {isRevokingAll && <Spinner />}
                                        Відкликати всі
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Відкликати всі доступи для{' '}
                                            {appName}?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Усі активні сеанси авторизації для
                                            цього застосунку будуть завершені, і
                                            застосунку знадобиться повторна
                                            авторизація.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Відмінити
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={() => revokeAll()}>
                                            Підтвердити
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button
                                variant="ghost"
                                size="md"
                                className="w-9 p-0"
                            >
                                <LucideChevronsUpDown className="size-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full overflow-hidden mt-4 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <div className="flex flex-col">
                        {tokens.map((token) => (
                            <AuthorizedAppItem key={token.reference} token={token} />
                        ))}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default AuthorizedAppGroup;