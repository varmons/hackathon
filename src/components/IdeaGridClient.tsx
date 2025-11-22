'use client';

import Link from 'next/link';
import {useMemo, useState} from 'react';
import {Idea, IdeaCard} from './IdeaCard';
import {IdeaFilters} from './IdeaFilters';
import {AppLocale} from '@/i18n';

type Props = {
    ideas: Idea[];
    locale: AppLocale;
};

export function IdeaGridClient({ideas, locale}: Props) {
    const [filtered, setFiltered] = useState<Idea[]>(ideas);

    const tags = useMemo(() => {
        const set = new Set<string>();
        ideas.forEach((i) => i.tags.forEach((t) => set.add(t)));
        return Array.from(set);
    }, [ideas]);

    const handleFilter = (tag: string | 'all', sort: string) => {
        let next = ideas;
        if (tag !== 'all') {
            next = ideas.filter((idea) => idea.tags.includes(tag));
        }
        if (sort === 'latest') {
            next = [...next].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        setFiltered(next);
    };

    return (
        <div className="space-y-6">
            <IdeaFilters tags={tags} onFilter={handleFilter} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((idea) => (
                    <Link key={idea.id} href={`/${locale}/ideas/${idea.id}`} className="block h-full">
                        <IdeaCard idea={idea} locale={locale} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
