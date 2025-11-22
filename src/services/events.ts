import {httpClient} from '@/lib/httpClient';

export type EventSummary = {
    id: string;
    title: string;
};

export const eventService = {
    async list(): Promise<EventSummary[]> {
        const res = await httpClient.get<EventSummary[]>('/api/events');
        if (res.success) return res.data;
        return [];
    },
};
