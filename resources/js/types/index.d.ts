export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: 'admin' | 'user';
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    flash: {
        success: string | null;
        info?: string | null;
        error?: string | null;
        warning?: string | null;
    };
};

export interface TargetUlasan {
    id: number;
    tipe: 'PEGAWAI' | 'DIVISI';
    nama: string;
    is_active: boolean;
    deskripsi: string;
    metadata?: any;
}

export interface sentiment_prediksi {
    label: string;
    score: number;
}

export interface Ulasan {
    sentimen_prediksi: string | null;
    skor_sentimen: number;
    id: number;
    konten: string;
    rating: number | null;
    created_at: string;
    user: User | null;
    target_ulasan: TargetUlasan;
    visibilitas: string;
    butuh_tinjauan_manual: boolean;
    sentimen_terverifikasi: string | null;
}

export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}
