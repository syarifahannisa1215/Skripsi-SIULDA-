import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';

createInertiaApp({
    title: title => `${title} - SIULDA`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster richColors position="top-center" /> 
            </>
        );
    },
    progress: { color: '#2563eb' },
});