'use client';

import {
    useArtifactPrivacy,
    useSession,
    useUpdateArtifactPrivacy,
} from '@hikka/react';
import { LockKeyhole, Share2, UsersRound } from 'lucide-react';
import { useParams } from 'next/navigation';

import H3 from '@/components/typography/h3';
import P from '@/components/typography/p';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const PrivacySetting = () => {
    const params = useParams<{ username: string }>();
    const { user: loggedUser } = useSession();
    const { mutate: updateArtifactPrivacy } = useUpdateArtifactPrivacy();

    const { data: artifactPrivacy } = useArtifactPrivacy({
        name: 'year-summary-2025',
    });

    if (params.username !== loggedUser?.username) {
        return null;
    }

    const handleChangeVisibility = (value: string) => {
        updateArtifactPrivacy({
            name: 'year-summary-2025',
            args: {
                private: value === 'private',
            },
        });
    };

    return (
        <div className="flex items-center justify-between border gap-4 p-4 bg-secondary/20 rounded-md backdrop-blur md:flex-row flex-col">
            <div className="flex items-center gap-4 flex-1">
                <Share2 className="size-6 shrink-0" />
                <div className="flex flex-col justify-center gap-2 flex-1">
                    <H3 className="leading-5">Приватність</H3>
                    <P className="text-sm text-muted-foreground">
                        Змініть налаштування конфіденційності, щоб увімкнути
                        спільний доступ до посилання
                    </P>
                </div>
            </div>
            <Select
                value={[artifactPrivacy?.private ? 'private' : 'public']}
                onValueChange={(value) => handleChangeVisibility(value[0])}
            >
                <SelectTrigger className="w-full md:w-auto">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectList>
                        <SelectItem value="private">
                            <div className="flex items-center gap-2">
                                <LockKeyhole className="size-4" /> Приватна
                            </div>
                        </SelectItem>
                        <SelectItem value="public">
                            <div className="flex items-center gap-2">
                                <UsersRound className="size-4" /> Публічна
                            </div>
                        </SelectItem>
                    </SelectList>
                </SelectContent>
            </Select>
        </div>
    );
};

export default PrivacySetting;
