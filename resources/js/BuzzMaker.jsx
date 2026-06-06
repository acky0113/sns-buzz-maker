import React, { useEffect, useMemo, useState } from 'react';

const templates = [
    {
        id: 'standard',
        name: '通常投稿',
        tag: 'Free',
        premium: false,
        prompt: 'SNSで使いやすい通常投稿',
        description: 'まずは読みやすく、共感される投稿を作ります。',
    },
    {
        id: 'viral',
        name: 'バズ狙い',
        tag: 'Premium',
        premium: true,
        prompt: '冒頭の引きが強く、拡散されやすいバズ狙い投稿',
        description: 'スクロールを止める一言から始めます。',
    },
    {
        id: 'sales',
        name: '販売導線',
        tag: 'Premium',
        premium: true,
        prompt: '商品やサービスの申込みにつながるセールス投稿',
        description: '読後に行動したくなる流れへ整えます。',
    },
    {
        id: 'line',
        name: 'LINE誘導',
        tag: 'Premium',
        premium: true,
        prompt: 'LINE登録や問い合わせへ自然に誘導する投稿',
        description: '売り込み感を抑えて導線を作ります。',
    },
    {
        id: 'safe',
        name: '炎上回避',
        tag: 'Premium',
        premium: true,
        prompt: '角が立ちにくく、誤解されにくい表現でまとめた投稿',
        description: '攻めながらも安心して出せる文章にします。',
    },
];

const benefits = [
    ['投稿数を増やせる', '毎日のネタ出しと文章化をAIに任せて、企画や分析に時間を使えます。'],
    ['売上導線まで作れる', 'Premiumなら、集客・販売・LINE誘導など目的別テンプレートが使えます。'],
    ['改善サイクルが速い', '生成後にスコアを見ながら、より伸びる投稿へ磨き込めます。'],
];

const comparisonRows = [
    ['1日の生成回数', '3回まで', '無制限'],
    ['投稿テンプレート', '通常投稿のみ', 'バズ狙い・販売導線・LINE誘導・炎上回避'],
    ['生成後の改善提案', '一部プレビュー', '改善案までフル活用'],
    ['おすすめの使い方', 'まず試す', '毎日のSNS運用に使う'],
];

const faqs = [
    ['無料プランでは何回使えますか？', '無料ユーザーは1日3回まで投稿を生成できます。'],
    ['Premiumにすると何が変わりますか？', '生成回数の制限がなくなり、目的別テンプレートや改善導線を使って投稿制作を続けられます。'],
    ['どんなテーマに向いていますか？', '副業、店舗集客、個人ブランド、商品紹介、キャンペーン告知など、SNS投稿全般に使えます。'],
];

const scoreItems = [
    ['共感度', 86],
    ['保存されやすさ', 78],
    ['行動導線', 64],
];

export default function BuzzMaker({ user, onCheckout }) {
    const [theme, setTheme] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new');
    const [history, setHistory] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [scores, setScores] = useState(null);
    const [copied, setCopied] = useState(false);

    const remaining = useMemo(() => {
        if (user.is_premium) return null;
        const today = new Date().toISOString().slice(0, 10);
        const todayCount = history.filter((item) => item.created_at?.slice(0, 10) === today).length;
        return Math.max(0, 3 - todayCount);
    }, [history.length, user.is_premium]);

    const remainingLabel = user.is_premium ? '無制限で生成できます' : `本日の無料枠 残り${remaining}回`;

    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/generations?user_id=${user.id}`);
            const data = await res.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleTemplateSelect = (template) => {
        if (template.premium && !user.is_premium) {
            onCheckout();
            return;
        }

        setSelectedTemplate(template);
    };

    const handleGenerate = async (e, override = {}) => {
        e?.preventDefault();
        setLoading(true);
        setCopied(false);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme,
                    user_id: user.id,
                    template_type: selectedTemplate.id,
                    action: override.action || 'generate',
                    original_content: override.originalContent || generatedText,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setGeneratedText(data.content);
                setScores(data.scores || null);
                fetchHistory();
            } else {
                alert(data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('この履歴を削除しますか？')) return;
        const res = await fetch(`/api/generations/${id}`, { method: 'DELETE' });
        if (res.ok) setHistory(history.filter((item) => item.id !== id));
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => setCopied(true));
    };

    const handleFavorite = async (id) => {
        const res = await fetch(`/api/generations/${id}/favorite`, { method: 'POST' });
        if (res.ok) fetchHistory();
    };

    return (
        <main id="top">
            <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                    <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black">
                        {remainingLabel}
                    </div>
                    <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                        投稿を作るだけでなく
                        <span className="block text-[#e9471b]">成果につなげる。</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-neutral-700">
                        SNS Buzz Makerは、投稿テーマから本文を作るだけでなく、目的別テンプレートと改善スコアで
                        「出して終わり」ではないSNS運用をサポートします。
                    </p>
                    {!user.is_premium && (
                        <div className="mt-8 rounded-lg border-2 border-[#e9471b] bg-white p-5 shadow-[8px_8px_0_#171717]">
                            <p className="text-sm font-black text-[#e9471b]">無料枠を使い切る前に</p>
                            <p className="mt-2 text-2xl font-black">Premiumなら、生成回数もテンプレートも制限なし。</p>
                            <div className="mt-5">
                                <div className="mb-2 flex justify-between text-sm font-black">
                                    <span>本日の使用状況</span>
                                    <span>{3 - remaining} / 3 回</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                                    <div className="h-3 rounded-full bg-[#e9471b]" style={{ width: `${((3 - remaining) / 3) * 100}%` }} />
                                </div>
                            </div>
                            <button
                                onClick={onCheckout}
                                className="mt-5 rounded-full bg-[#ffcf24] px-7 py-4 text-base font-black text-black shadow-[0_5px_0_#171717] transition hover:-translate-y-0.5"
                            >
                                Premiumで無制限にする
                            </button>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[10px_10px_0_#171717]">
                    <div className="mb-5 flex gap-2 border-b border-black/10 pb-3">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`rounded-full px-4 py-2 text-sm font-black ${activeTab === 'new' ? 'bg-[#171717] text-white' : 'bg-neutral-100 text-neutral-500'}`}
                        >
                            投稿生成
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`rounded-full px-4 py-2 text-sm font-black ${activeTab === 'history' ? 'bg-[#171717] text-white' : 'bg-neutral-100 text-neutral-500'}`}
                        >
                            履歴
                        </button>
                    </div>

                    {activeTab === 'new' ? (
                        <form onSubmit={handleGenerate} className="space-y-5">
                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <span className="text-sm font-black text-neutral-700">投稿テンプレート</span>
                                    {!user.is_premium && (
                                        <span className="rounded-full bg-[#fff1b8] px-3 py-1 text-xs font-black text-[#7a5600]">
                                            Premiumで全解放
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {templates.map((template) => {
                                        const locked = template.premium && !user.is_premium;
                                        const active = selectedTemplate.id === template.id;
                                        return (
                                            <button
                                                key={template.id}
                                                type="button"
                                                onClick={() => handleTemplateSelect(template)}
                                                className={`min-h-24 rounded-md border p-4 text-left transition ${
                                                    active
                                                        ? 'border-[#171717] bg-[#171717] text-white'
                                                        : locked
                                                            ? 'border-black/10 bg-neutral-50 text-neutral-500 hover:border-[#e9471b]'
                                                            : 'border-black/10 bg-white hover:border-[#171717]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="font-black">{template.name}</span>
                                                    <span className={`rounded-full px-2 py-1 text-[11px] font-black ${active ? 'bg-white text-black' : template.premium ? 'bg-[#ffcf24] text-black' : 'bg-neutral-100 text-neutral-600'}`}>
                                                        {locked ? 'LOCK' : template.tag}
                                                    </span>
                                                </div>
                                                <p className={`mt-2 text-sm leading-6 ${active ? 'text-white/70' : 'text-neutral-500'}`}>
                                                    {template.description}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <label className="block">
                                <span className="text-sm font-black text-neutral-700">投稿テーマ</span>
                                <input
                                    type="text"
                                    className="mt-2 w-full rounded-md border border-black/15 bg-white p-4 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                                    placeholder="例：週末に集客したいカフェの告知"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    required
                                />
                            </label>

                            <button
                                disabled={loading}
                                className="w-full rounded-full bg-[#171717] py-4 font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? '生成中...' : `${selectedTemplate.name}で投稿文を生成する`}
                            </button>

                            {generatedText && (
                                <div className="space-y-4">
                                    <div className="relative rounded-md border border-[#e9471b]/25 bg-[#fff8e6] p-5 leading-7">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(generatedText)}
                                            className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black hover:bg-neutral-100"
                                        >
                                            コピー
                                        </button>
                                        <p className="whitespace-pre-wrap pr-16">{generatedText}</p>
                                    </div>
                                    {copied && (
                                        <div className="rounded-md border border-black/10 bg-white p-4">
                                            <p className="text-sm font-black text-[#e9471b]">コピーしました。次にやること</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <a href="https://x.com/compose/post" target="_blank" className="rounded-full bg-[#171717] px-4 py-2 text-sm font-black text-white">
                                                    Xで投稿する
                                                </a>
                                                <button type="button" onClick={(event) => handleGenerate(event, { action: 'shorten' })} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-black">
                                                    X向けに短くする
                                                </button>
                                                <button type="button" onClick={(event) => handleGenerate(event, { action: 'line' })} className="rounded-full bg-[#ffcf24] px-4 py-2 text-sm font-black">
                                                    LINE誘導版にする
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-md border border-black/10 bg-white p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-black text-neutral-500">AI投稿スコア</p>
                                                <p className="mt-1 text-xl font-black">あと少しで、もっと伸ばせます。</p>
                                            </div>
                                            {!user.is_premium && (
                                                <span className="rounded-full bg-[#ffcf24] px-3 py-1 text-xs font-black">
                                                    Premium限定
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-5 space-y-3">
                                            {(scores ? [
                                                ['共感度', scores.empathy],
                                                ['保存されやすさ', scores.save],
                                                ['行動導線', scores.action],
                                            ] : scoreItems).map(([label, score]) => (
                                                <div key={label}>
                                                    <div className="mb-1 flex justify-between text-sm font-black">
                                                        <span>{label}</span>
                                                        <span>{score}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-neutral-100">
                                                        <div className="h-2 rounded-full bg-[#e9471b]" style={{ width: `${score}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {user.is_premium ? (
                                            <button
                                                type="button"
                                                onClick={(event) => handleGenerate(event, { action: 'improve' })}
                                                className="mt-5 w-full rounded-full bg-[#ffcf24] px-5 py-3 font-black text-black"
                                            >
                                                スコアアップ版を作る
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={onCheckout}
                                                className="mt-5 w-full rounded-full bg-[#ffcf24] px-5 py-3 font-black text-black shadow-[0_4px_0_#171717] transition hover:-translate-y-0.5"
                                            >
                                                Premiumで改善案を解放する
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="space-y-3">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <div key={item.id} className="rounded-md border border-black/10 bg-[#f7f4ee] p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-black text-neutral-500">{item.template_type || 'standard'}</p>
                                                <p className="mt-1 font-black">{item.theme}</p>
                                                {(item.empathy_score || item.save_score || item.action_score) && (
                                                    <p className="mt-2 text-xs font-bold text-neutral-500">
                                                        共感 {item.empathy_score || '-'} / 保存 {item.save_score || '-'} / 導線 {item.action_score || '-'}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    onClick={() => handleFavorite(item.id)}
                                                    className={`rounded-full px-3 py-1 text-xs font-black ${item.is_favorite ? 'bg-[#ffcf24] text-black' : 'bg-white text-neutral-500'}`}
                                                >
                                                    {item.is_favorite ? 'お気に入り' : '保存'}
                                                </button>
                                                {!user.is_premium && (
                                                    <button
                                                        onClick={onCheckout}
                                                        className="rounded-full bg-[#ffcf24] px-3 py-1 text-xs font-black text-black"
                                                    >
                                                        改善
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-sm font-black text-red-500 hover:text-red-700"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-md bg-[#f7f4ee] py-10 text-center font-black text-neutral-400">
                                    履歴はまだありません。
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="border-y border-black/10 bg-white py-12">
                <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-3">
                    {benefits.map(([title, description]) => (
                        <article key={title} className="rounded-lg border border-black/10 p-6">
                            <h2 className="text-xl font-black">{title}</h2>
                            <p className="mt-3 leading-7 text-neutral-600">{description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {!user.is_premium && (
                <>
                    <section className="bg-[#171717] py-14 text-white">
                        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-sm font-black text-[#ffcf24]">無料ユーザーが失っているもの</p>
                                <h2 className="mt-2 text-4xl font-black tracking-tight">
                                    投稿できない日は、見込み客との接点も減っていく。
                                </h2>
                                <p className="mt-4 leading-8 text-white/70">
                                    ネタ切れ、文章の質のムラ、無料枠の上限。小さな詰まりが続くと、SNS運用は止まります。
                                    Premiumは、毎日投稿を続けるための制作環境です。
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {['無料枠を気にして試せない', '販売投稿を作るのに時間がかかる', '投稿の改善ポイントが分からない', '毎日の投稿が続かない'].map((item) => (
                                    <div key={item} className="rounded-lg border border-white/15 p-5 font-black">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="pricing" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div>
                            <p className="text-sm font-black text-[#e9471b]">Premium</p>
                            <h2 className="mt-2 text-4xl font-black tracking-tight">無料枠の先まで、投稿を作り続ける。</h2>
                            <p className="mt-4 leading-8 text-neutral-700">
                                反応が取れる投稿は、作って試す回数で磨かれます。
                                Premiumなら生成回数を気にせず、目的別テンプレートと改善導線で毎日の運用を前に進められます。
                            </p>
                            <button
                                onClick={onCheckout}
                                className="mt-7 rounded-full bg-[#ffcf24] px-7 py-4 text-base font-black text-black shadow-[0_5px_0_#171717] transition hover:-translate-y-0.5"
                            >
                                今すぐPremiumにする
                            </button>
                        </div>
                        <div className="overflow-hidden rounded-lg border-2 border-black bg-white shadow-[10px_10px_0_#171717]">
                            <div className="grid grid-cols-3 bg-[#171717] text-white">
                                <div className="p-4 text-sm font-black">機能</div>
                                <div className="p-4 text-sm font-black">Free</div>
                                <div className="bg-[#ffcf24] p-4 text-sm font-black text-black">Premium</div>
                            </div>
                            {comparisonRows.map(([label, free, premium]) => (
                                <div key={label} className="grid grid-cols-3 border-t border-black/10">
                                    <div className="p-4 text-sm font-black">{label}</div>
                                    <div className="p-4 text-sm text-neutral-500">{free}</div>
                                    <div className="bg-[#fff8d6] p-4 text-sm font-bold">{premium}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            <section className="bg-[#171717] py-14 text-white">
                <div className="mx-auto max-w-7xl px-5">
                    <h2 className="text-3xl font-black tracking-tight">よくある質問</h2>
                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                        {faqs.map(([question, answer]) => (
                            <article key={question} className="rounded-lg border border-white/15 p-5">
                                <h3 className="font-black">{question}</h3>
                                <p className="mt-3 leading-7 text-white/70">{answer}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
