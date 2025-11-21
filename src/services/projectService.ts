import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const projectService = {
    async getProjects(params: { category?: string; search?: string }) {
        const where: Prisma.ProjectWhereInput = {
            published: true,
        };

        if (params.category) {
            where.category = {
                slug: params.category,
            };
        }

        if (params.search) {
            where.OR = [
                { title: { contains: params.search } },
                { description: { contains: params.search } },
            ];
        }

        return prisma.project.findMany({
            where,
            include: {
                author: { select: { name: true, image: true } },
                category: true,
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getProjectById(id: string) {
        return prisma.project.findUnique({
            where: { id },
            include: {
                author: { select: { name: true, image: true } },
                category: true,
                tags: true,
            },
        });
    },

    async createProject(data: {
        title: string;
        description: string;
        content?: string;
        repositoryUrl?: string;
        demoUrl?: string;
        categoryId: string;
        authorId: string;
        tags?: string[];
    }) {
        const { tags, ...rest } = data;
        const normalizedTags = tags
            ?.map((tag) => tag.trim())
            .filter(Boolean);

        const tagConnectOrCreate = normalizedTags && normalizedTags.length > 0
            ? Array.from(new Set(normalizedTags)).map((tagName) => {
                const slug = slugify(tagName);
                return {
                    where: { slug },
                    create: { name: tagName, slug },
                };
            })
            : undefined;

        return prisma.project.create({
            data: {
                ...rest,
                published: true,
                tags: tagConnectOrCreate
                    ? {
                        connectOrCreate: tagConnectOrCreate,
                    }
                    : undefined,
            },
        });
    },

    async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
        return prisma.project.update({
            where: { id },
            data,
        });
    },

    async deleteProject(id: string) {
        return prisma.project.delete({
            where: { id },
        });
    },
};
