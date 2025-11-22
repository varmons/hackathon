import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {AppLocale, normalizeLocale} from '@/i18n';
import {IdeaGridClient} from '@/components/IdeaGridClient';
import {Idea} from '@/components/IdeaCard';
import {ideaRepository} from '@/domain/ideas/ideaRepository';

export default async function IdeasPage({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const normalizedLocale = normalizeLocale(locale) as AppLocale;
    const t = await getTranslations('idea.list');

    const ideasDb = await ideaRepository.list();
    const ideas: Idea[] = ideasDb.map((idea) => ({
        id: idea.id,
        title: idea.title,
        summary: idea.summary,
        tags: Array.isArray(idea.tags) ? (idea.tags as string[]) : [],
        createdAt: idea.createdAt,
        location: idea.location ?? undefined,
        thumbnail: idea.thumbnail ?? undefined,
    }));

    return (
        <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
            <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
                </div>
                <Link
                    href={`/${normalizedLocale}/ideas/new`}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    {t('cta.create')}
                </Link>
            </section>

            <section className="space-y-6">
                <IdeaGridClient locale={normalizedLocale} ideas={ideas} />
            </section>
        </div>
    );
}
