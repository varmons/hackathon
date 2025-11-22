import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Calendar, ExternalLink, Github, User} from 'lucide-react';
import {projectRepository} from '@/domain/projects/projectRepository';
import {AppLocale} from '@/i18n';
import {ProjectWithRelations} from '@/types';
import {formatDate, formatNumber} from '@/utils/format';
import {getTranslations} from 'next-intl/server';
import {EngagementBar} from '@/components/EngagementBar';

export default async function ProjectPage({params}: { params: Promise<{ id: string; locale: string }> }) {
    const {id, locale} = await params;
    const normalizedLocale = locale as AppLocale;
    const project: ProjectWithRelations | null = await projectRepository.findByIdAndIncrementView(id);
    const t = await getTranslations('page.project');

    if (!project) {
        notFound();
    }

    const gallery = Array.isArray(project.galleryUrls) ? (project.galleryUrls as string[]) : [];

    return (
        <div className="container mx-auto px-4 py-12">
            <Link
                href={`/${normalizedLocale}`}
                className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
                &larr; {t('back')}
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                            {project.thumbnail ? (
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">{t('noImage')}</div>
                            )}
                        </div>

                        <div className="p-6 md:p-8">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>

                            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{project.author.name || t('anonymous')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(project.createdAt, normalizedLocale)}</span>
                                </div>
                                {project.category && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        {project.category.name}
                                    </span>
                                )}
                            </div>

                                <div className="prose max-w-none dark:prose-invert">
                                    <p className="whitespace-pre-wrap">{project.description}</p>
                                    {project.content && (
                                        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
                                            <p className="whitespace-pre-wrap">{project.content}</p>
                                        </div>
                                )}
                            </div>

                            {gallery.length > 1 && (
                                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('gallery')}</h3>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {gallery.slice(1).map((img, idx) => (
                                            <img
                                                key={`${img}-${idx}`}
                                                src={img}
                                                alt={`${project.title}-${idx + 1}`}
                                                className="h-28 w-full rounded-lg object-cover"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('links')}</h3>
                        <div className="space-y-3">
                            {project.repositoryUrl && (
                                <a
                                    href={project.repositoryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <Github className="h-5 w-5" />
                                    {t('viewCode')}
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 p-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <ExternalLink className="h-5 w-5" />
                                    {t('viewDemo')}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('stats')}</h3>
                        <EngagementBar
                            entity="project"
                            id={project.id}
                            initialViews={project.views ?? 0}
                            initialLikes={project.likes ?? 0}
                            labels={{views: t('views'), likes: t('likes')}}
                        />
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t('tags')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {(project.tags ?? []).map((tag: { id: string; name: string; slug: string }) => (
                                <span
                                    key={tag.id}
                                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
