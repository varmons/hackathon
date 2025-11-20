import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/services/projectService';
import { z } from 'zod';

const projectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    content: z.string().optional(),
    repositoryUrl: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    authorId: z.string(),
    categoryId: z.string(),
    tags: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    try {
        const projects = await projectService.getProjects({ category, search });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = projectSchema.parse(body);

        const project = await projectService.createProject(validated);

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 400 });
    }
}
