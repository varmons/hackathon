import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
        return prisma.project.create({
            data: {
                ...rest,
                published: true,
                tags: tags ? {
                    connect: tags.map((t) => ({ id: t })), // Assuming tags are IDs
                } : undefined,
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
