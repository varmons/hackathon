import {PrismaClient} from '@prisma/client';
import {Prisma} from '@prisma/client';

const prisma = new PrismaClient();

export const eventRepository = {
    async list() {
        return prisma.event.findMany({
            orderBy: {startAt: 'asc'},
        });
    },
    async findById(id: string) {
        return prisma.event.findUnique({
            where: {id},
        });
    },

    async findByIdAndIncrementView(id: string) {
        return prisma.event.update({
            where: {id},
            data: {views: {increment: 1}},
        });
    },

    async incrementLikes(id: string) {
        return prisma.event.update({
            where: {id},
            data: {likes: {increment: 1}},
        });
    },
    async create(data: {
        title: string;
        subtitle?: string;
        summary?: string;
        description?: string;
        location?: string;
        startAt: Date;
        endAt: Date;
        registerLink?: string;
        registerDeadline?: Date;
        capacity?: number | null;
        bannerUrl?: string;
        galleryUrls?: string[];
        attachments?: unknown;
        status?: string;
    }) {
        return prisma.event.create({
            data: {
                ...data,
                galleryUrls: data.galleryUrls as Prisma.InputJsonValue,
                attachments: data.attachments as Prisma.InputJsonValue,
            },
        });
    },
};
