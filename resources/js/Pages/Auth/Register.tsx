import { Head, Link, useForm } from '@inertiajs/react';
import React, { type FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Daftar Akun" />
            <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun SIULDA</CardTitle>
                        <CardDescription>
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="font-medium text-emerald-600 hover:underline">
                                Login di sini
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    placeholder="Nama Anda"
                                    value={data.name} 
                                    autoComplete="name" 
                                    onChange={(e) => setData('name', e.target.value)} 
                                    required 
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="nama@email.com"
                                    value={data.email} 
                                    autoComplete="username" 
                                    onChange={(e) => setData('email', e.target.value)} 
                                    required 
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    value={data.password} 
                                    autoComplete="new-password" 
                                    onChange={(e) => setData('password', e.target.value)} 
                                    required 
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input 
                                    id="password_confirmation" 
                                    type="password" 
                                    value={data.password_confirmation} 
                                    autoComplete="new-password" 
                                    onChange={(e) => setData('password_confirmation', e.target.value)} 
                                    required 
                                />
                                {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full mt-2">
                                {processing ? 'Memproses...' : 'Daftar Akun'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}