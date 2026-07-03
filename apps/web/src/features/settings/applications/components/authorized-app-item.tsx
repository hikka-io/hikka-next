import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import { toast } from 'sonner';

import {
    type AuthTokenInfoResponse,
    revokeTokenMutation,
    thirdPartyAuthTokensInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsVerifiedRounded from '@/components/icons/material-symbols/MaterialSymbolsVerifiedRounded';
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
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
    token: AuthTokenInfoResponse;
};

const AuthorizedAppItem: FC<Props> = ({ token }) => {
    const queryClient = useQueryClient();

    const { mutate: revokeToken, isPending: isRevoking } = useMutation({
        ...revokeTokenMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: thirdPartyAuthTokensInfiniteOptions().queryKey,
            });
            toast.success('Доступ застосунку успішно відкликано.');
        },
        onError: () => {
            toast.error('Не вдалося відкликати доступ. Спробуйте ще раз.');
        },
    });

    const handleRevoke = () => {
        revokeToken({ path: { token_reference: token.reference } });
    };

    return (
        <Card className="flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-2 overflow-hidden">
                <div className="flex items-center gap-2">
                    <h5 className="line-clamp-1">
                        {token.client?.name ?? 'Невідомий застосунок'}
                    </h5>
                    {token.client?.verified && (
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                                <div className="rounded-sm border border-border surface-inset p-1">
                                    <MaterialSymbolsVerifiedRounded className="text-primary-foreground" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <Label className="text-sm">Верифіковано</Label>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {token.client?.description && (
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                        {token.client.description}
                    </p>
                )}
                {token.created && (
                    <p className="text-muted-foreground text-xs opacity-60">
                        Авторизовано{' '}
                        {format(new Date(token.created * 1000), 'd MMMM yyyy')}
                    </p>
                )}
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        className="shrink-0"
                        variant="destructive"
                        size="md"
                        disabled={isRevoking}
                    >
                        {isRevoking && <Spinner />}
                        Відкликати
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Відкликати доступ для{' '}
                            {token.client?.name ?? 'цього застосунку'}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Застосунок втратить доступ до вашого акаунту і йому
                            знадобиться повторна авторизація.
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
        </Card>
    );
};

export default AuthorizedAppItem;
