import ProjectCard from '@/components/ProjectCard';
import {projectRepository} from '@/domain/projects/projectRepository';
import {AppLocale} from '@/i18n';
import {ProjectWithRelations} from '@/types';
import {getTranslations} from 'next-intl/server';

export default async function HomePage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const {locale} = await params;
    const normalizedLocale = locale as AppLocale;
    const {category, search} = await searchParams;

    const t = await getTranslations('page.home');
    const projects: ProjectWithRelations[] = await projectRepository.list({
        category,
        search,
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {t('title')}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} locale={normalizedLocale} />
                ))}
            </div>

            {projects.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t('empty')}</div>
            )}
        </div>
    );
}
