import {projectRepository} from '@/domain/projects/projectRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const project = await projectRepository.incrementLikes(id);
        return NextResponse.json(successResponse({likes: project.likes}));
    } catch (error) {
        console.error('[API] Failed to increment likes', error);
        return NextResponse.json(errorResponse('PROJECT.UPDATE_FAILED'), {status: 400});
    }
}
