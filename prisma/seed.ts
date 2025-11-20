import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Categories
    const categories = ['AI', 'Web3', 'Game', 'Tool', 'Social']
    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, slug: name.toLowerCase() },
        })
    }

    // Create Tags
    const tags = ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma']
    for (const name of tags) {
        await prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name, slug: name.toLowerCase() },
        })
    }

    // Create Demo User
    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            name: 'Demo User',
            image: 'https://github.com/shadcn.png',
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
