'use client';

import {
    useArtifactPrivacy,
    useSession,
    useUpdateArtifactPrivacy,
} from '@hikka/react';
import { LockKeyhole, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import H3 from '@/components/typography/h3';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { YEAR } from './constants';

const PrivacySetting = () => {
    const params = useParams<{ username: string }>();
    const { user: loggedUser } = useSession();
    const {
        mutate: updateArtifactPrivacy,
        mutateAsync: updateArtifactPrivacyAsync,
    } = useUpdateArtifactPrivacy();

    const { data: artifactPrivacy } = useArtifactPrivacy({
        name: 'year-summary-2025',
    });

    if (params.username !== loggedUser?.username) {
        return null;
    }

    const handleShare = async () => {
        await updateArtifactPrivacyAsync({
            name: 'year-summary-2025',
            args: {
                private: false,
            },
        });

        navigator.clipboard.writeText(
            `${window.location.origin}/summary/${params.username}/${YEAR}`,
        );
        toast.success('Ви успішно скопіювали посилання на свої підсумки року.');
    };

    const handleHide = async () => {
        await updateArtifactPrivacyAsync({
            name: 'year-summary-2025',
            args: {
                private: true,
            },
        });
        toast.success('Ви успішно приховали свої підсумки року.');
    };

    return (
        <div className="flex  justify-between border gap-4 p-4 bg-secondary/20 rounded-md backdrop-blur flex-col">
            <div className="flex items-center gap-4 flex-1">
                <Share2 className="size-6 shrink-0" />
                <div className="flex flex-col justify-center gap-2 flex-1">
                    <H3 className="leading-5">Поділіться своїми підсумками</H3>
                    <P className="text-xs text-muted-foreground">
                        Поділіться посиланням на свої підсумки року, щоб інші
                        користувачі могли побачити їх
                    </P>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    disabled={artifactPrivacy?.private}
                    readOnly
                    value={
                        artifactPrivacy?.private
                            ? 'Поділіться, щоб відкрити посилання'
                            : `${window.location.origin}/summary/${params.username}/${YEAR}`
                    }
                />
                {artifactPrivacy?.private && (
                    <Button
                        onClick={handleShare}
                        variant={
                            artifactPrivacy?.private ? 'outline' : 'success'
                        }
                        className="shrink-0"
                    >
                        <Share2 />
                        Поділитись
                    </Button>
                )}
                {!artifactPrivacy?.private && (
                    <Button
                        onClick={handleHide}
                        variant="destructive"
                        className="shrink-0"
                    >
                        <LockKeyhole />
                        Приховати
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PrivacySetting;
