import { LinkIcon } from 'lucide-react';

import type { UserReferenceResponse } from '@hikka/api';

import MaterialSymbolsFormatQuoteRounded from '@/components/icons/material-symbols/MaterialSymbolsFormatQuoteRounded';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import type { AboutTeamMember } from '@/utils/constants/about-data';
import { Link } from '@/utils/navigation';

type TeamMemberCardProps = {
    member: AboutTeamMember;
    profile: UserReferenceResponse;
};

function TeamMemberCard({ member, profile }: TeamMemberCardProps) {
    const username = profile.username ?? member.reference;
    const avatar = (
        <Link to={`/u/${username}`} className="shrink-0">
            <Avatar className="size-20 rounded-md ring-1 ring-black/10 ring-inset sm:size-24 dark:ring-white/10">
                <AvatarImage src={profile.avatar} alt={`Аватар ${username}`} />
            </Avatar>
        </Link>
    );

    if ('memorial' in member) {
        return (
            <Card className="flex-row items-center overflow-hidden md:col-span-2 xl:col-span-3">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/[0.07] via-transparent to-yellow-400/[0.07]"
                />

                {avatar}

                <div className="min-w-0 flex-1">
                    <p className="mb-1.5 font-semibold text-amber-500 text-xs tracking-wide dark:text-amber-400">
                        {member.role}
                    </p>
                    <h3 className="truncate">
                        <Link to={`/u/${username}`} className="hover:underline">
                            {username}
                        </Link>
                    </h3>
                    <p className="mt-1 max-w-3xl text-pretty text-muted-foreground text-sm leading-relaxed">
                        {member.memorial}
                    </p>
                </div>
            </Card>
        );
    }

    const quote =
        'quoteFromProfile' in member && member.quoteFromProfile
            ? profile.description
            : null;

    return (
        <Card className="gap-0 overflow-hidden p-0">
            <div className="flex min-w-0 gap-4 p-4">
                {avatar}

                <div className="flex min-w-0 flex-1 flex-col">
                    <div>
                        <h3 className="truncate">
                            <Link
                                to={`/u/${username}`}
                                className="hover:underline"
                            >
                                {username}
                            </Link>
                        </h3>
                        <p className="text-pretty text-muted-foreground text-sm">
                            {member.role}
                        </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3">
                        {member.links.map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                size="sm"
                                className="text-primary-foreground hover:text-primary-foreground/80"
                                render={<Link to={link.href} />}
                            >
                                <LinkIcon aria-hidden="true" />
                                {link.title}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {quote && (
                <div className="flex gap-2 text-pretty border-border border-t px-4 py-3.5 text-muted-foreground">
                    <MaterialSymbolsFormatQuoteRounded
                        aria-hidden="true"
                        className="size-5 shrink-0"
                    />
                    <MDViewer className="prose-inline text-sm italic">
                        {quote}
                    </MDViewer>
                </div>
            )}
        </Card>
    );
}

export default TeamMemberCard;
