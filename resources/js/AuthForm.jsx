import React, { useState } from 'react';
import SiteFooter from './SiteFooter';

const proofItems = [
    '1テーマから投稿案を即生成',
    '無料でも1日3回試せる',
    'Premiumで目的別テンプレ解放',
];

const featureItems = [
    ['ネタ切れを防ぐ', '投稿テーマを入れるだけで、切り口・本文・ハッシュタグまで一気に作れます。'],
    ['売れる投稿に寄せる', 'Premiumなら販売導線、LINE誘導、バズ狙いなど目的別に投稿を作れます。'],
    ['改善ポイントが見える', '生成後にスコアを見て、伸ばすべきポイントを確認できます。'],
];

const premiumTemplates = [
    ['バズ狙い', '冒頭の引きと共感でスクロールを止める'],
    ['販売導線', '商品やサービスの申込みにつなげる'],
    ['LINE誘導', '自然に登録や問い合わせへ誘導する'],
    ['炎上回避', '誤解されにくい表現へ整える'],
];

const comparisonRows = [
    ['生成回数', '1日3回', '無制限'],
    ['投稿タイプ', '通常投稿', '目的別テンプレート'],
    ['改善提案', 'プレビューのみ', 'スコアアップ導線'],
    ['向いている人', 'まず試したい人', '毎日SNS運用したい人'],
];

const trustItems = [
    ['無料で開始', 'まずは1日3回まで投稿生成を試せます。'],
    ['決済はStripe', 'Premiumの決済は外部決済サービスで安全に処理します。'],
    ['法務ページ整備', '利用規約、プライバシーポリシー、特商法表記を用意しています。'],
    ['問い合わせ対応', '決済や使い方の相談をフォームから受け付けます。'],
];

const flowItems = [
    ['1', '投稿ジャンルを登録', '使うSNS、目的、ジャンルを入れて、AIが文脈を掴みやすくします。'],
    ['2', 'テンプレートを選ぶ', '通常投稿から始めて、必要に応じて販売導線やバズ狙いへ広げます。'],
    ['3', '生成して改善', 'スコアを見ながら、保存されやすさや行動導線を磨きます。'],
];

const useCases = [
    ['個人事業主', '毎日の投稿ネタを切らさず、サービス紹介まで自然につなげたい人に。'],
    ['店舗運営', 'キャンペーン告知、来店誘導、LINE登録まで短時間で作りたい人に。'],
    ['副業・発信者', '限られた時間で投稿数を増やし、反応を見ながら改善したい人に。'],
];

export default function AuthForm({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snsPlatform, setSnsPlatform] = useState('X');
    const [snsGoal, setSnsGoal] = useState('集客したい');
    const [postingGenre, setPostingGenre] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/login' : '/api/register';
        const payload = isLogin ? { email, password } : {
            name,
            email,
            password,
            sns_platform: snsPlatform,
            sns_goal: snsGoal,
            posting_genre: postingGenre,
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                onAuthSuccess(data.user);
            } else {
                setError(data.message || '入力内容を確認してください。');
            }
        } catch (err) {
            setError('通信エラーが発生しました。時間をおいてもう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
                <div className="text-xl font-black tracking-tight">SNS Buzz Maker</div>
                <div className="flex items-center gap-3">
                    <a href="/pricing" className="hidden text-sm font-bold text-neutral-600 hover:text-black sm:inline">料金</a>
                    <a href="/samples" className="hidden text-sm font-bold text-neutral-600 hover:text-black sm:inline">サンプル</a>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold hover:border-black"
                    >
                        {isLogin ? '無料で始める' : 'ログイン'}
                    </button>
                </div>
            </header>

            <main id="top">
                <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                    <div>
                        <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black">
                            SNS運用を、毎日続く収益導線に。
                        </div>
                        <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                            バズる投稿を
                            <span className="block text-[#e9471b]">今日から量産。</span>
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-neutral-700">
                            SNS Buzz Makerは、投稿テーマを入れるだけでSNS向けの本文を作れるAI投稿制作ツールです。
                            Premiumなら、バズ狙い・販売導線・LINE誘導まで目的別に作れます。
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {proofItems.map((item) => (
                                <span key={item} className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border-2 border-black bg-white p-4 shadow-[10px_10px_0_#171717]">
                        <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
                            <div>
                                <p className="text-xs font-black uppercase text-neutral-500">AI Writer</p>
                                <p className="font-black">投稿生成プレビュー</p>
                            </div>
                            <span className="rounded-full bg-[#ffcf24] px-3 py-1 text-xs font-black">Premium対応</span>
                        </div>
                        <div className="space-y-3">
                            <div className="rounded-md bg-[#f7f4ee] p-4">
                                <p className="text-xs font-bold text-neutral-500">テーマ</p>
                                <p className="mt-1 font-black">副業を始めたい会社員向けの投稿</p>
                            </div>
                            <div className="rounded-md bg-[#171717] p-5 text-white">
                                <p className="text-xs font-bold text-white/60">生成結果</p>
                                <p className="mt-3 leading-7">
                                    「時間がない」は、副業を始めない理由に見えて、実は仕組み化していないサインかもしれません。
                                    まずは毎日15分、未来の収入源を育てる時間を作ってみましょう。
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#ffcf24]">
                                    <span>#副業</span>
                                    <span>#SNS運用</span>
                                    <span>#AI活用</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-black/10 bg-white py-10">
                    <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-3">
                        {featureItems.map(([title, description]) => (
                            <article key={title} className="rounded-lg border border-black/10 p-6">
                                <h2 className="text-xl font-black">{title}</h2>
                                <p className="mt-3 leading-7 text-neutral-600">{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-12">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {trustItems.map(([title, description]) => (
                            <article key={title} className="rounded-lg border border-black/10 bg-white p-5">
                                <p className="text-lg font-black">{title}</p>
                                <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div>
                        <p className="text-sm font-black text-[#e9471b]">Premiumで解放</p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight">
                            ただの投稿生成から、成果別の投稿制作へ。
                        </h2>
                        <p className="mt-4 leading-8 text-neutral-700">
                            無料でも投稿は作れます。けれど、SNS運用で本当に欲しいのは
                            「売る」「集める」「伸ばす」ための投稿です。
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {premiumTemplates.map(([title, description]) => (
                            <article key={title} className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0_#171717]">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-black">{title}</h3>
                                    <span className="rounded-full bg-[#ffcf24] px-2 py-1 text-[11px] font-black">Premium</span>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="bg-[#171717] py-14 text-white">
                    <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="text-sm font-black text-[#ffcf24]">Free vs Premium</p>
                            <h2 className="mt-2 text-4xl font-black tracking-tight">
                                無料で試して、必要になったら無制限へ。
                            </h2>
                            <p className="mt-4 leading-8 text-white/70">
                                最初は無料でOK。でも、毎日投稿したい人ほど生成回数と目的別テンプレートの差が効いてきます。
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-white/15 bg-white text-[#171717]">
                            <div className="grid grid-cols-3 bg-[#ffcf24]">
                                <div className="p-4 text-sm font-black">機能</div>
                                <div className="p-4 text-sm font-black">Free</div>
                                <div className="p-4 text-sm font-black">Premium</div>
                            </div>
                            {comparisonRows.map(([label, free, premium]) => (
                                <div key={label} className="grid grid-cols-3 border-t border-black/10">
                                    <div className="p-4 text-sm font-black">{label}</div>
                                    <div className="p-4 text-sm text-neutral-500">{free}</div>
                                    <div className="bg-[#fff8d6] p-4 text-sm font-bold">{premium}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-14">
                    <p className="text-sm font-black text-[#e9471b]">How it works</p>
                    <h2 className="mt-2 max-w-3xl text-4xl font-black tracking-tight">
                        登録して、選んで、改善する。SNS運用の流れを短く。
                    </h2>
                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {flowItems.map(([number, title, description]) => (
                            <article key={number} className="rounded-lg border-2 border-black bg-white p-6 shadow-[6px_6px_0_#171717]">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ffcf24] text-sm font-black">{number}</span>
                                <h3 className="mt-5 text-xl font-black">{title}</h3>
                                <p className="mt-3 leading-7 text-neutral-600">{description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="border-y border-black/10 bg-white py-14">
                    <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="text-sm font-black text-[#e9471b]">Use cases</p>
                            <h2 className="mt-2 text-4xl font-black tracking-tight">誰が使っても、投稿作業を前に進めやすい。</h2>
                            <p className="mt-4 leading-8 text-neutral-700">
                                ただ文章を作るだけではなく、目的に合わせた投稿へ変換できるので、発信の手が止まりにくくなります。
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {useCases.map(([title, description]) => (
                                <article key={title} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-5">
                                    <h3 className="text-xl font-black">{title}</h3>
                                    <p className="mt-2 leading-7 text-neutral-600">{description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <p className="text-sm font-black text-[#e9471b]">まずは無料で体験</p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                            アカウントを作って、投稿生成を試す
                        </h2>
                        <p className="mt-4 leading-8 text-neutral-700">
                            Premiumは、無料枠を使い切ったあとに必要性を感じてからで大丈夫です。
                            まずは実際に投稿が作れる感覚を確認してください。
                        </p>
                    </div>

                    <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <label className="block">
                                        <span className="text-sm font-bold text-neutral-700">お名前</span>
                                        <input
                                            type="text"
                                            required
                                            className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </label>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="text-sm font-bold text-neutral-700">使うSNS</span>
                                            <select value={snsPlatform} onChange={(e) => setSnsPlatform(e.target.value)} className="mt-2 block w-full rounded-md border border-black/15 bg-white p-3 outline-none focus:border-[#e9471b]">
                                                <option>X</option>
                                                <option>Instagram</option>
                                                <option>TikTok</option>
                                                <option>LINE</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-bold text-neutral-700">目的</span>
                                            <select value={snsGoal} onChange={(e) => setSnsGoal(e.target.value)} className="mt-2 block w-full rounded-md border border-black/15 bg-white p-3 outline-none focus:border-[#e9471b]">
                                                <option>集客したい</option>
                                                <option>販売したい</option>
                                                <option>フォロワーを増やしたい</option>
                                                <option>LINE登録を増やしたい</option>
                                            </select>
                                        </label>
                                    </div>
                                    <label className="block">
                                        <span className="text-sm font-bold text-neutral-700">投稿ジャンル</span>
                                        <input
                                            type="text"
                                            required
                                            placeholder="例：副業、美容サロン、カフェ、コーチング"
                                            className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                                            value={postingGenre}
                                            onChange={(e) => setPostingGenre(e.target.value)}
                                        />
                                    </label>
                                </>
                            )}

                            <label className="block">
                                <span className="text-sm font-bold text-neutral-700">メールアドレス</span>
                                <input
                                    type="email"
                                    required
                                    className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-bold text-neutral-700">パスワード</span>
                                <input
                                    type="password"
                                    required
                                    className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>

                            {error && <div className="rounded-md bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full bg-[#171717] px-6 py-4 text-base font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? '処理中...' : isLogin ? 'ログインして使う' : '無料で投稿を作る'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="bg-[#171717] px-5 py-16 text-white">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="text-sm font-black text-[#ffcf24]">Start now</p>
                        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                            まずは1投稿、AIで作ってみる。
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/70">
                            無料枠で試して、毎日使いたくなったらPremiumへ。投稿作業を止めない環境を作りましょう。
                        </p>
                        <a href="#top" className="mt-8 inline-flex rounded-full bg-[#ffcf24] px-8 py-4 font-black text-black shadow-[0_5px_0_white]">
                            無料で始める
                        </a>
                    </div>
                </section>
            </main>
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#fffdf8]/95 px-4 py-3 backdrop-blur sm:hidden">
                <button
                    onClick={() => {
                        setIsLogin(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full rounded-full bg-[#ffcf24] px-5 py-3 font-black text-black shadow-[0_4px_0_#171717]"
                >
                    無料で投稿を作る
                </button>
            </div>
            <SiteFooter />
        </div>
    );
}
