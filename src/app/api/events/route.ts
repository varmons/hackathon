import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {eventRepository} from '@/domain/events/eventRepository';
import {errorResponse, successResponse} from '@/utils/apiResponse';

const eventSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    registerLink: z.string().url().optional().or(z.literal('')).transform((v) => v || undefined),
    registerDeadline: z.coerce.date().optional(),
    capacity: z.coerce.number().int().positive().optional(),
    bannerUrl: z.string().url().optional().or(z.literal('')).transform((v) => v || undefined),
    galleryUrls: z.array(z.string()).max(10).optional(),
    attachments: z
        .array(
            z.object({
                name: z.string(),
                type: z.string(),
                size: z.number(),
                content: z.string(),
            }),
        )
        .max(10)
        .optional(),
    status: z.string().optional(),
});

export async function GET() {
    try {
        const events = await eventRepository.list();
        return NextResponse.json(successResponse(events));
    } catch (error) {
        console.error('[API] Failed to list events', error);
        return NextResponse.json(errorResponse('EVENT.LIST_FAILED'), {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = eventSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                errorResponse('COMMON.VALIDATION_ERROR', 'Invalid payload', parsed.error.flatten()),
                {status: 400},
            );
        }
        const event = await eventRepository.create(parsed.data);
        return NextResponse.json(successResponse(event), {status: 201});
    } catch (error) {
        console.error('[API] Failed to create event', error);
        return NextResponse.json(errorResponse('EVENT.CREATE_FAILED'), {status: 500});
    }
}
