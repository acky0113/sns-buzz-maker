import './bootstrap';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BuzzMaker from './BuzzMaker';
import AuthForm from './AuthForm';
import StaticPage from './StaticPage';
import SiteFooter from './SiteFooter';

export const PREMIUM_PRICE_ID = 'price_1TfGmjALvV5JskUSXxYOArLm';

function MainApp() {
    const [user, setUser] = useState(null);
    const currentPath = window.location.pathname;

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return;

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            fetch('/api/payment-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: parsedUser.id }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.history.replaceState(null, '', '/');
                });
        }
    }, []);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout error', err);
        }
        setUser(null);
        localStorage.clear();
    };

    const handleCheckout = async () => {
        if (!user) return;

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, price_id: PREMIUM_PRICE_ID }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('決済画面の読み込みに失敗しました。時間をおいてもう一度お試しください。');
        }
    };

    if ([
        '/contact',
        '/pricing',
        '/cancel-policy',
        '/guide',
        '/samples',
        '/mypage',
        '/admin-inquiries',
        '/thanks',
        '/ai-sns-post-generator',
        '/x-post-generator',
        '/instagram-caption-generator',
        '/terms',
        '/privacy',
        '/legal',
    ].includes(currentPath)) {
        return <StaticPage path={currentPath} user={user} onCheckout={handleCheckout} onUserUpdate={handleAuthSuccess} />;
    }

    if (!user) {
        return <AuthForm onAuthSuccess={handleAuthSuccess} />;
    }

    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#fffdf8]/95 px-5 py-3 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <a href="#top" className="text-lg font-black tracking-tight">
                        SNS Buzz Maker
                    </a>
                    <div className="flex items-center gap-3">
                        <a href="/mypage" className="hidden text-sm font-bold text-neutral-600 hover:text-neutral-900 sm:inline">
                            マイページ
                        </a>
                        <span className="hidden text-sm font-semibold text-neutral-600 sm:inline">
                            {user.name} さん
                        </span>
                        {user.is_premium ? (
                            <span className="rounded-full bg-[#181818] px-3 py-1 text-xs font-bold text-white">
                                Premium
                            </span>
                        ) : (
                            <button
                                onClick={handleCheckout}
                                className="rounded-full bg-[#ffcf24] px-4 py-2 text-sm font-black text-black shadow-[0_4px_0_#171717] transition hover:-translate-y-0.5"
                            >
                                Premiumにする
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-sm font-bold text-neutral-500 hover:text-neutral-900"
                        >
                            ログアウト
                        </button>
                    </div>
                </div>
            </nav>

            <BuzzMaker user={user} onCheckout={handleCheckout} />
            <SiteFooter />
        </div>
    );
}

const container = document.getElementById('app');
if (container) {
    createRoot(container).render(<MainApp />);
}
