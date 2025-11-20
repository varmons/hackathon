import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    content: z.string().optional(),
    repositoryUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    categoryId: z.string().optional(),
    published: z.boolean().optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                author: {
                    select: { name: true, image: true },
                },
                category: true,
                tags: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    try {
        const body = await request.json();
        const validated = updateSchema.parse(body);

        const project = await prisma.project.update({
            where: { id },
            data: validated,
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    try {
        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
