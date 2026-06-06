import React from 'react';

const links = [
    ['料金', '/pricing'],
    ['使い方', '/guide'],
    ['サンプル投稿', '/samples'],
    ['マイページ', '/mypage'],
    ['お問い合わせ', '/contact'],
    ['解約・返金ポリシー', '/cancel-policy'],
    ['AI SNS投稿作成', '/ai-sns-post-generator'],
    ['利用規約', '/terms'],
    ['プライバシーポリシー', '/privacy'],
    ['特定商取引法に基づく表記', '/legal'],
];

export default function SiteFooter() {
    return (
        <footer className="border-t border-black/10 bg-[#fffdf8] px-5 py-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-black tracking-tight">SNS Buzz Maker</p>
                    <p className="mt-1 text-sm font-medium text-neutral-500">AIでSNS投稿制作をもっと速く、もっと成果寄りに。</p>
                </div>
                <nav className="flex flex-wrap gap-4 text-sm font-bold text-neutral-600">
                    {links.map(([label, href]) => (
                        <a key={href} href={href} className="hover:text-[#e9471b]">
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}
