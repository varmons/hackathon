'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Calendar, Github, ExternalLink, Eye, ThumbsUp } from 'lucide-react';
import { ProjectWithRelations } from '@/types';

interface ProjectCardProps {
    project: ProjectWithRelations;
    locale: string;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
    const t = useTranslations('ProjectCard');

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
            <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                        {t('noImage')}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {project.category && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {project.category.name}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.createdAt).toLocaleDateString(locale)}
                    </span>
                </div>

                <h3 className="mb-1 text-lg font-semibold leading-tight text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    <Link href={`/${locale}/project/${project.id}`}>
                        <span className="absolute inset-0" />
                        {project.title}
                    </Link>
                </h3>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {project.description}
                </p>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {project.views} {t('views')}
                        </div>
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            {project.likes} {t('likes')}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 z-10">
                        {project.repositoryUrl && (
                            <a
                                href={project.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        )}
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
