import { Head, Link, useForm } from '@inertiajs/react';
import React, { type FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import { Chrome } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login" />
            <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">Login ke SIULDA</CardTitle>
                        <CardDescription>
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="font-medium text-emerald-600 hover:underline">
                                Daftar di sini
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <Button variant="outline" asChild>
                                <a href={route('google.auth')}>
                                    <Chrome className="mr-2 h-4 w-4" />
                                    Lanjutkan dengan Google
                                </a>
                            </Button>
                        </div>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Atau lanjutkan dengan
                                </span>
                            </div>
                        </div>
                        <form onSubmit={submit} className="grid gap-4">
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
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/* Link "Lupa Password?" bisa ditambahkan di sini jika perlu */}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember" 
                                    checked={data.remember} 
                                    onCheckedChange={(checked) => setData('remember', Boolean(checked))}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                                    Ingat saya
                                </Label>
                            </div>
                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Memproses...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}