import { useState } from 'react';

import {
    DragDropProvider,
    type DragEndEvent,
    PointerSensor,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    API_LIMITS,
    changeLinksMutation,
    parseUserLinks,
    type UserLink,
} from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsLinkRounded from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useSession } from '@/services/session';
import {
    invalidateSession,
    invalidateUserProfile,
} from '@/utils/api/invalidate-content-state';
import { createDragDropManager } from '@/utils/drag-drop-manager';
import { newId } from '@/utils/new-id';

import ProfileLinkForm from './profile-link-form';
import ProfileLinkRow from './profile-link-row';

const SENSORS = [
    PointerSensor.configure({ activationConstraints: () => undefined }),
];

type LinkDraft = UserLink & { id: string };

const toDraft = (link: UserLink): LinkDraft => ({ ...link, id: newId() });

const ProfileLinks = () => {
    const { user: loggedUser } = useSession();
    const queryClient = useQueryClient();
    const [manager] = useState(() =>
        createDragDropManager({ sensors: SENSORS }),
    );
    const [editing, setEditing] = useState<number | 'new' | null>(null);

    const mutationChangeLinks = useMutation({
        ...changeLinksMutation(),
        onSuccess: () => {
            invalidateSession(queryClient);
            if (loggedUser) {
                invalidateUserProfile(queryClient, loggedUser.username);
            }
            toast.success('Ви успішно оновили посилання профілю.');
        },
    });

    const form = useAppForm({
        defaultValues: {
            links: parseUserLinks(loggedUser?.links).map(toDraft),
        },
        onSubmit: async ({ value }) => {
            mutationChangeLinks.mutate({
                body: { links: value.links.map(({ id, ...link }) => link) },
            });
        },
    });

    return (
        <form.AppForm>
            <form.Field
                name="links"
                mode="array"
                children={(field) => {
                    const links = field.state.value;
                    const editedLink =
                        typeof editing === 'number'
                            ? links[editing]
                            : undefined;

                    const handleDragEnd = (event: DragEndEvent) => {
                        const { source } = event.operation;
                        if (event.canceled || !isSortable(source)) return;

                        const from = links.findIndex(
                            (link) => link.id === source.id,
                        );
                        const to = source.sortable.index;

                        if (from !== -1 && from !== to) {
                            field.moveValue(from, to);
                        }
                    };

                    const handleSubmitLink = (link: UserLink) => {
                        if (editedLink && typeof editing === 'number') {
                            field.replaceValue(editing, {
                                ...link,
                                id: editedLink.id,
                            });
                        } else {
                            field.pushValue(toDraft(link));
                        }
                        setEditing(null);
                    };

                    return (
                        <>
                            <form.Form className="flex flex-col items-start gap-4">
                                <div className="flex w-full items-center justify-between gap-2">
                                    <Label>Посилання</Label>
                                    <span className="text-muted-foreground text-sm tabular-nums">
                                        {links.length} /{' '}
                                        {API_LIMITS.userLinks.max}
                                    </span>
                                </div>
                                {links.length > 0 ? (
                                    <div className="flex w-full flex-col gap-2">
                                        <DragDropProvider
                                            manager={manager}
                                            onDragEnd={handleDragEnd}
                                        >
                                            {links.map((link, index) => (
                                                <ProfileLinkRow
                                                    key={link.id}
                                                    id={link.id}
                                                    index={index}
                                                    count={links.length}
                                                    link={link}
                                                    onEdit={() =>
                                                        setEditing(index)
                                                    }
                                                    onRemove={() =>
                                                        field.removeValue(index)
                                                    }
                                                    onMove={(to) =>
                                                        field.moveValue(
                                                            index,
                                                            to,
                                                        )
                                                    }
                                                />
                                            ))}
                                        </DragDropProvider>
                                    </div>
                                ) : (
                                    <EmptyState
                                        size="sm"
                                        bordered
                                        className="w-full"
                                        icon={<MaterialSymbolsLinkRounded />}
                                        title="Ви ще не додали посилань"
                                    />
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="md"
                                        variant="outline"
                                        disabled={
                                            links.length >=
                                            API_LIMITS.userLinks.max
                                        }
                                        onClick={() => setEditing('new')}
                                    >
                                        <MaterialSymbolsAddRounded />
                                        Додати посилання
                                    </Button>
                                    <SubmitButton
                                        size="md"
                                        loading={mutationChangeLinks.isPending}
                                    >
                                        Зберегти
                                    </SubmitButton>
                                </div>
                            </form.Form>
                            <ResponsiveModal
                                open={editing !== null}
                                onOpenChange={(open) =>
                                    !open && setEditing(null)
                                }
                            >
                                <ResponsiveModalContent
                                    title={
                                        editedLink
                                            ? 'Редагувати посилання'
                                            : 'Нове посилання'
                                    }
                                >
                                    <ProfileLinkForm
                                        key={editedLink?.id ?? 'new'}
                                        link={editedLink}
                                        takenUrls={links
                                            .filter(
                                                (link) =>
                                                    link.id !== editedLink?.id,
                                            )
                                            .map((link) => link.url)}
                                        onSubmit={handleSubmitLink}
                                        onDelete={
                                            typeof editing === 'number'
                                                ? () => {
                                                      field.removeValue(
                                                          editing,
                                                      );
                                                      setEditing(null);
                                                  }
                                                : undefined
                                        }
                                    />
                                </ResponsiveModalContent>
                            </ResponsiveModal>
                        </>
                    );
                }}
            />
        </form.AppForm>
    );
};

export default ProfileLinks;
