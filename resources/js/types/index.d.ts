declare module '@inertiajs/react' {
    export interface PageProps {
        auth: {
            user: User | null;
        };
        flash: {
            success: string | null;
        };
    }
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: 'admin' | 'user';
}

export interface TargetUlasan {
    id: number;
    tipe: 'PEGAWAI' | 'DIVISI';
    nama: string;
    is_active: boolean;
    deskripsi: string;
}

export interface Ulasan {
    sentimen_prediksi: sentiment_prediksi;
    id: number;
    konten: string;
    rating: number | null;
    created_at: string;
    user: User | null;
    target_ulasan: TargetUlasan;
    visibilitas: string;
}

export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}
