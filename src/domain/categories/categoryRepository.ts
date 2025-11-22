import {prisma} from '@/lib/prisma';

export const categoryRepository = {
    async list() {
        return prisma.category.findMany({
            orderBy: {name: 'asc'},
        });
    },
};
