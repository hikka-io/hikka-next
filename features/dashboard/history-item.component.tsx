import format from 'date-fns/format';
import Link from 'next/link';
import { FC } from 'react';
import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';

interface Props {
    username: string;
    time: number;
    edit_id: number;
    status: API.EditStatus; // TODO: add api for moderation of other things
}

const HistoryItem: FC<Props> = ({ username, time, edit_id, status }) => {
    return (
        <div className="flex gap-2 hover:no-underline">
            <div className="flex size-6 items-center justify-center rounded-sm bg-secondary/60 p-1">
                {status === 'accepted' && (
                    <MaterialSymbolsCheckRounded className="text-[#50e3c2]" />
                )}
                {status === 'denied' && (
                    <MaterialSymbolsCloseRounded className="text-[#d93036]" />
                )}
            </div>
            <div className="flex w-full flex-col">
                <div className="flex flex-1 items-center justify-between">
                    <h5 className="font-display text-sm font-medium leading-6">
                        <Link href={`/u/${username}`}>{username}</Link>
                    </h5>
                    <h5 className="text-xs font-medium text-muted-foreground">
                        {format(time * 1000, 'd MMMM HH:mm')}
                    </h5>
                </div>
                <h5 className="text-sm font-medium text-muted-foreground">
                    {status === 'accepted' && 'Прийнято правку '}
                    {status === 'denied' && 'Відхилено правку '}
                    <Link className="inline-block" href={`/edit/${edit_id}`}>
                        <h5 className="font-semibold text-white">#{edit_id}</h5>
                    </Link>
                </h5>
            </div>
        </div>
    );
};

export default HistoryItem;
