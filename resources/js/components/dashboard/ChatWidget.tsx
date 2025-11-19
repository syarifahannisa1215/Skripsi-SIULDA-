import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
type Message = { text: string; isBot: boolean };

const initialMessage: Message = {
    text: 'Halo! Saya Asisten Analis SIULDA. Tanyakan sesuatu tentang data ulasan, misalnya "Bagaimana performa kita?"',
    isBot: true
};

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([initialMessage]);
    const [input, setInput] = useState('');
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        const el = viewportRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(route('dashboard.chat'), {
                message: userMsg
            });

            const botReply = response.data.reply;
            setMessages(prev => [...prev, { text: botReply, isBot: true }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { text: "Maaf, terjadi gangguan pada sistem. Silakan coba lagi.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
                aria-label="Buka Chat"
            >
                <MessageCircle className="h-7 w-7" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b space-y-0">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Asisten Analis
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Tutup Chat">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
                {/*@ts-ignore*/}
                <ScrollArea className="flex-1 min-h-0" viewportref={viewportRef}>
                    <div className="space-y-4 p-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex", msg.isBot ? "justify-start" : "justify-end")}>
                                <div className={cn(
                                    "rounded-lg px-3 py-2 max-w-[85%] text-sm",
                                    msg.isBot ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-3 border-t bg-background flex gap-2 flex-none">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            const isComposing = (e as any).nativeEvent?.isComposing;
                            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Tulis pertanyaan..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button size="icon" onClick={sendMessage} disabled={isLoading} aria-label="Kirim pesan">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
