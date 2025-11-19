import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { User, Building, MessageSquareText } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { route } from 'ziggy-js';

interface SearchResult {
    id: string;
    group: string;
    name: string;
    context?: string;
    url: string;
}

interface CommandPaletteProps {
    open: boolean;
    setOpen: (open: (currentOpen: any) => boolean) => void;
}

const Highlight = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="font-bold text-emerald-600">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((currentOpen) => !currentOpen);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        if (debouncedSearchQuery.length < 2) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route('dashboard.search', { q: debouncedSearchQuery }));
                setResults(response.data);
            } catch (error) {
                console.error("Gagal mengambil hasil pencarian:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedSearchQuery]);

    const handleSelect = (url: string) => {
        setOpen(false);
        router.get(url);
    };

    const groupedResults = results.reduce((acc, result) => {
        (acc[result.group] = acc[result.group] || []).push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    const getIcon = (group: string) => {
        if (group === 'Pengguna') return <User className="mr-2 h-4 w-4" />;
        if (group === 'Target Ulasan') return <Building className="mr-2 h-4 w-4" />;
        if (group === 'Ulasan') return <MessageSquareText className="mr-2 h-4 w-4" />;
        return null;
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Cari pengguna, target, atau ulasan..."
                value={searchQuery}
                onValueChange={setSearchQuery}
            />
            <CommandList>
                {loading ? (
                    <div className="p-4 text-sm text-center text-muted-foreground">Mencari...</div>
                ) : !searchQuery.trim() ? (
                    <div className="p-4 text-sm text-center text-muted-foreground">Mulai ketik untuk mencari.</div>
                ) : results.length === 0 ? (
                    <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
                ) : (
                    Object.entries(groupedResults).map(([group, items]) => (
                        <CommandGroup key={group} heading={group}>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    onSelect={() => handleSelect(item.url)}
                                    value={`${group}-${item.name}-${item.context || ''}`}
                                >
                                    {getIcon(group)}
                                    <div className="flex flex-col">
                                        <Highlight text={item.name} highlight={searchQuery} />
                                        {item.context && (
                                            <span className="text-xs text-muted-foreground">
                                                {item.context}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))
                )}
            </CommandList>
        </CommandDialog>
    );
}
