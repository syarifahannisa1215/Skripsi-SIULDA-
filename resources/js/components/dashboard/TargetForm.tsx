import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { TargetUlasan } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { route } from 'ziggy-js';

interface TargetFormProps {
    target?: TargetUlasan | null;
    onSuccess: () => void;
}

export function TargetForm({ target, onSuccess }: TargetFormProps) {
    const isEditing = !!target;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nama: target?.nama || '',
        tipe: target?.tipe || '',
        deskripsi: target?.deskripsi || '',
        metadata: JSON.stringify(target?.metadata || {}, null, 2),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { onSuccess: () => onSuccess() };
        if (isEditing) {
            patch(route('dashboard.target.update', { target: target.id }), options);
        } else {
            post(route('dashboard.target.store'), options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="nama">Nama Target</Label>
                <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tipe">Tipe</Label>
                <Select onValueChange={(value) => setData('tipe', value)} value={data.tipe}>
                    <SelectTrigger><SelectValue placeholder="Pilih tipe target" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PEGAWAI">Pegawai</SelectItem>
                        <SelectItem value="DIVISI">Divisi</SelectItem>
                    </SelectContent>
                </Select>
                {errors.tipe && <p className="text-sm text-destructive">{errors.tipe}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                <Textarea id="deskripsi" value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="metadata">Metadata (JSON, Opsional)</Label>
                <Textarea id="metadata" value={data.metadata} onChange={(e) => setData('metadata', e.target.value)} rows={4} placeholder='Contoh: { "nip": "12345", "jabatan": "Staf" }' />
                {errors.metadata && <p className="text-sm text-destructive">{errors.metadata}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </div>
        </form>
    );
}