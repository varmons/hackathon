import {ideaRepository} from '@/domain/ideas/ideaRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(_: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    try {
        const idea = await ideaRepository.findById(id);
        if (!idea) {
            return NextResponse.json(errorResponse('IDEA.NOT_FOUND'), {status: 404});
        }
        return NextResponse.json(successResponse(idea));
    } catch (error) {
        console.error('[API] Failed to fetch idea', error);
        return NextResponse.json(errorResponse('IDEA.LIST_FAILED'), {status: 500});
    }
}
