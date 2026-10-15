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
    type UserLinkResponse,
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

type LinkDraft = UserLinkResponse & { id: string };

const toDraft = (link: UserLinkResponse): LinkDraft => ({
    ...link,
    id: newId(),
});

const ProfileLinks = () => {
    const { user: loggedUser } = useSession();
    const queryClient = useQueryClient();
    const [manager] = useState(() =>
        createDragDropManager({ sensors: SENSORS }),
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [target, setTarget] = useState<LinkDraft | null>(null);
    const [defaultLinks] = useState(() =>
        parseUserLinks(loggedUser?.links).map(toDraft),
    );

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
            links: defaultLinks,
        },
        onSubmit: async ({ value }) => {
            mutationChangeLinks.mutate({
                body: {
                    links: value.links.map(({ url, text }) => ({ url, text })),
                },
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
                    const targetIndex = target
                        ? links.findIndex((link) => link.id === target.id)
                        : -1;

                    const openModal = (link: LinkDraft | null) => {
                        setTarget(link);
                        setModalOpen(true);
                    };

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

                    const handleSubmitLink = (link: UserLinkResponse) => {
                        if (target && targetIndex !== -1) {
                            field.replaceValue(targetIndex, {
                                ...link,
                                id: target.id,
                            });
                        } else {
                            field.pushValue(toDraft(link));
                        }
                        setModalOpen(false);
                    };

                    return (
                        <>
                            <form.Form className="flex flex-col items-start gap-6">
                                <div className="flex w-full flex-col gap-2">
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
                                                            openModal(link)
                                                        }
                                                        onRemove={() =>
                                                            field.removeValue(
                                                                index,
                                                            )
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
                                            bordered
                                            className="w-full"
                                            icon={
                                                <MaterialSymbolsLinkRounded />
                                            }
                                            title="Ви ще не додали посилань"
                                            description="Додайте посилання на свої профілі в інших сервісах"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="md"
                                        variant="outline"
                                        disabled={
                                            links.length >=
                                            API_LIMITS.userLinks.max
                                        }
                                        onClick={() => openModal(null)}
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
                                open={modalOpen}
                                onOpenChange={setModalOpen}
                            >
                                <ResponsiveModalContent
                                    title={
                                        target
                                            ? 'Редагувати посилання'
                                            : 'Нове посилання'
                                    }
                                >
                                    <ProfileLinkForm
                                        key={target?.id ?? 'new'}
                                        link={target ?? undefined}
                                        takenUrls={links
                                            .filter(
                                                (link) =>
                                                    link.id !== target?.id,
                                            )
                                            .map((link) => link.url)}
                                        onSubmit={handleSubmitLink}
                                        onDelete={
                                            target
                                                ? () => {
                                                      field.removeValue(
                                                          targetIndex,
                                                      );
                                                      setModalOpen(false);
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
