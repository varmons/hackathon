'use client';

import {useRef, useState} from 'react';
import {Image as ImageIcon, Trash2, Upload} from 'lucide-react';
import {useTranslations} from 'next-intl';

type ImageUploaderProps = {
    value: string[];
    onChange: (images: string[]) => void;
    max?: number;
};

const MAX_SIZE_MB = 3;

export function ImageUploader({value, onChange, max = 9}: ImageUploaderProps) {
    const t = useTranslations('form.project.images');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const current = [...value];
        for (const file of Array.from(files)) {
            if (current.length >= max) break;
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(t('tooLarge', {size: MAX_SIZE_MB}));
                continue;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    current.push(result);
                    onChange(current.slice(0, max));
                    setError('');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{t('label')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('helper', {count: max})}</div>
            </div>

            <div
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-800"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                }}
            >
                <Upload className="h-4 w-4" />
                <span>{t('cta')}</span>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            {value.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {value.map((img, idx) => (
                        <div
                            key={`${img}-${idx}`}
                            className="relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                        >
                            <img src={img} alt={t('alt', {index: idx + 1})} className="h-32 w-full object-cover" />
                            <button
                                type="button"
                                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                                aria-label={t('remove')}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {value.length < max && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
                        >
                            <ImageIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
