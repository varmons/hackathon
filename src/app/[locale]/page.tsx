import { getTranslations } from 'next-intl/server';
import { projectService } from '@/services/projectService';
import ProjectCard from '@/components/ProjectCard';
import { ProjectWithRelations } from '@/types';

export default async function HomePage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const { locale } = await params;
    const { category, search } = await searchParams;

    const t = await getTranslations('HomePage');
        const projects: ProjectWithRelations[] = await projectService.getProjects({
        category,
        search,
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {t('title')}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                    {t('subtitle')}
                </p>
            </div>

            {/* Search and Filter could go here */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} locale={locale} />
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    {t('noProjects')}
                </div>
            )}
        </div>
    );
}
