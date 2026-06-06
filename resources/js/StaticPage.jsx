import React, { useEffect, useState } from 'react';
import SiteFooter from './SiteFooter';

const operatorInfo = {
    seller: 'SNS Buzz Maker 運営事務局',
    manager: '廣瀬尚哉',
    address: '大阪府大阪市浪速区浪速1丁目8-10 LUXE難波西III 1202',
    phone: '請求があった場合、遅滞なく開示します',
    email: 'snsbuzzmaker@gmail.com',
};

const comparisonRows = [
    ['生成回数', '1日3回まで', '無制限'],
    ['使えるテンプレート', '通常投稿', 'バズ狙い、販売導線、LINE誘導、炎上回避'],
    ['生成後の改善', 'スコア表示の一部', '改善導線まで利用可能'],
    ['おすすめ用途', 'まず試したい人', '毎日のSNS運用、集客、販売投稿'],
];

const samples = [
    {
        type: 'バズ狙い',
        theme: '副業を始めたい会社員向け',
        before: '副業を始めたい人は、まず時間を作りましょう。',
        after: '「時間がない」は、副業を始めない理由に見えて、実は仕組み化していないサインかもしれません。まずは毎日15分、未来の収入源を育てる時間を作ってみましょう。',
    },
    {
        type: '販売導線',
        theme: 'カフェの週末キャンペーン',
        before: '今週末キャンペーンをしています。ぜひ来てください。',
        after: '週末だけの限定セットをご用意しました。いつものコーヒーに、焼きたてスイーツを少しお得に。席数に限りがあるので、気になる方は早めにチェックしてください。',
    },
    {
        type: 'LINE誘導',
        theme: '美容サロンの予約導線',
        before: '予約はLINEからお願いします。',
        after: '空き枠や限定メニューはLINEで先にお知らせしています。気になる日時がある方は、まずLINEで希望日を送ってください。無理な案内はしません。',
    },
];

const guideSteps = [
    ['テーマを入力', '投稿したい商品、悩み、告知内容、伝えたいことを短く入力します。'],
    ['目的を選ぶ', '無料では通常投稿、Premiumではバズ狙い・販売導線・LINE誘導などを選べます。'],
    ['生成結果を確認', 'そのまま使える文章を確認し、必要に応じて表現を調整します。'],
    ['スコアを見て改善', '共感度、保存されやすさ、行動導線を見ながら次の投稿に活かします。'],
];

const pageContent = {
    '/terms': {
        label: '利用規約',
        title: '利用規約',
        lead: 'SNS Buzz Makerを安心して使っていただくための基本ルールです。',
        sections: [
            ['サービス内容', '本サービスは、入力されたテーマをもとにSNS投稿文の生成を支援するAIツールです。生成内容の利用判断、投稿内容の確認、公開後の管理はユーザーご自身の責任で行ってください。'],
            ['禁止事項', '第三者の権利を侵害する利用、虚偽情報の拡散、誹謗中傷、法令または公序良俗に反する目的での利用を禁止します。'],
            ['有料プラン', 'Premiumプランでは、生成回数や一部機能の制限が緩和されます。料金、更新、解約条件は決済画面または本サービス上の表示に従います。'],
            ['アカウント管理', 'ユーザーは登録情報を正確に保ち、第三者による不正利用を防ぐため適切に管理するものとします。'],
            ['免責事項', '生成結果の正確性、適法性、成果を保証するものではありません。投稿前に内容を確認し、必要に応じて修正してください。'],
        ],
    },
    '/privacy': {
        label: 'プライバシーポリシー',
        title: 'プライバシーポリシー',
        lead: '登録情報と投稿生成に必要な情報を、サービス提供と改善のために取り扱います。',
        sections: [
            ['取得する情報', '氏名、メールアドレス、ログイン情報、生成履歴、お問い合わせ内容、決済に必要な識別情報などを取得する場合があります。'],
            ['利用目的', 'アカウント管理、投稿生成、履歴表示、決済処理、問い合わせ対応、サービス改善のために利用します。'],
            ['第三者提供', '法令に基づく場合、決済処理など外部サービスの利用に必要な場合を除き、本人の同意なく第三者へ提供しません。'],
            ['安全管理', '取得した情報は、漏えい、滅失、毀損を防ぐため、合理的な安全管理措置を講じます。'],
            ['お問い合わせ', '個人情報の開示、訂正、削除などのご相談はお問い合わせページよりご連絡ください。'],
        ],
    },
    '/cancel-policy': {
        label: '解約・返金ポリシー',
        title: '解約・返金ポリシー',
        lead: 'Premiumプランの解約、更新、返金に関する考え方です。',
        sections: [
            ['解約について', 'Premiumプランは、所定の手続きによりいつでも解約できます。解約後は次回更新日以降、Premium機能が利用できなくなります。'],
            ['更新について', 'サブスクリプションは、解約手続きが完了するまで自動更新されます。更新日や請求金額は決済画面または管理画面でご確認ください。'],
            ['返金について', 'デジタルサービスの性質上、購入後または更新後の返金は原則としてお受けしていません。ただし、重複決済や明らかなシステム不具合が確認できた場合は個別に対応します。'],
            ['お問い合わせ', '解約や請求に関するご相談は、お問い合わせページよりご連絡ください。'],
        ],
    },
    '/legal': {
        label: '特定商取引法に基づく表記',
        title: '特定商取引法に基づく表記',
        lead: '有料プラン提供に必要な表示項目です。本番公開前に運営者情報へ差し替えてください。',
        sections: [
            ['販売事業者', operatorInfo.seller],
            ['運営責任者', operatorInfo.manager],
            ['所在地', operatorInfo.address],
            ['電話番号', operatorInfo.phone],
            ['メールアドレス', operatorInfo.email],
            ['販売価格', 'サービス上または決済画面に表示される価格をご確認ください。'],
            ['商品代金以外の必要料金', 'インターネット接続料金、通信料金はお客様の負担となります。'],
            ['支払方法', 'クレジットカード決済など、決済画面に表示される方法に対応します。'],
            ['提供時期', '決済完了後、Premium機能が利用可能になります。'],
            ['返品・キャンセル', 'デジタルサービスの性質上、購入後の返金は原則としてお受けしていません。解約は所定の手続きにより可能です。'],
        ],
    },
};

const seoPages = {
    '/ai-sns-post-generator': {
        label: 'AI SNS投稿作成ツール',
        title: 'AIでSNS投稿をすばやく作成。',
        lead: 'SNS Buzz Makerは、テーマを入力するだけでXやInstagram向けの投稿文を作れるAI投稿作成ツールです。',
        points: ['投稿ネタから本文まで一気に作成', 'バズ狙い・販売導線・LINE誘導に対応', '無料で試してPremiumで無制限に制作'],
    },
    '/x-post-generator': {
        label: 'X投稿作成ツール',
        title: 'Xで使いやすい短文投稿をAIで作成。',
        lead: '冒頭の引き、共感、ハッシュタグまで、X投稿に使いやすい文章を作れます。',
        points: ['短文に整えるコピー後アクション', 'バズ狙いテンプレート', '投稿履歴とお気に入り保存'],
    },
    '/instagram-caption-generator': {
        label: 'Instagramキャプション作成',
        title: 'Instagramのキャプション作成をもっと速く。',
        lead: '商品紹介、店舗告知、キャンペーン投稿など、Instagramで使いやすいキャプション作成を支援します。',
        points: ['店舗集客や商品紹介に対応', '販売導線テンプレート', 'LINE誘導文への変換'],
    },
};

export default function StaticPage({ path, user, onCheckout, onUserUpdate }) {
    if (path === '/contact') return <ContactPage />;
    if (path === '/pricing') return <PricingPage />;
    if (path === '/guide') return <GuidePage />;
    if (path === '/samples') return <SamplesPage />;
    if (path === '/mypage') return <MyPage user={user} onCheckout={onCheckout} onUserUpdate={onUserUpdate} />;
    if (path === '/admin-inquiries') return <AdminInquiries user={user} />;
    if (path === '/thanks') return <ThanksPage user={user} />;
    if (seoPages[path]) return <SeoPage content={seoPages[path]} />;

    const content = pageContent[path] || pageContent['/terms'];

    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label={content.label} />
            <main className="mx-auto max-w-4xl px-5 py-12">
                <p className="text-sm font-black text-[#e9471b]">{content.label}</p>
                <h1 className="mt-2 text-5xl font-black tracking-tight">{content.title}</h1>
                <p className="mt-5 leading-8 text-neutral-700">{content.lead}</p>
                <div className="mt-8 overflow-hidden rounded-lg border-2 border-black bg-white shadow-[10px_10px_0_#171717]">
                    {content.sections.map(([title, body]) => (
                        <section key={title} className="border-b border-black/10 p-6 last:border-b-0">
                            <h2 className="text-xl font-black">{title}</h2>
                            <p className="mt-3 leading-8 text-neutral-700">{body}</p>
                        </section>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

function MyPage({ user, onCheckout, onUserUpdate }) {
    const [snsPlatform, setSnsPlatform] = useState(user?.sns_platform || 'X');
    const [snsGoal, setSnsGoal] = useState(user?.sns_goal || '集客したい');
    const [postingGenre, setPostingGenre] = useState(user?.posting_genre || '');
    const [generations, setGenerations] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!user) return;

        setSnsPlatform(user.sns_platform || 'X');
        setSnsGoal(user.sns_goal || '集客したい');
        setPostingGenre(user.posting_genre || '');

        fetch(`/api/generations?user_id=${user.id}`)
            .then((res) => res.json())
            .then((data) => setGenerations(Array.isArray(data) ? data : []));
    }, [user]);

    if (!user) {
        return <AccountRequired label="マイページ" />;
    }

    const today = new Date().toISOString().slice(0, 10);
    const todayCount = generations.filter((item) => item.created_at?.slice(0, 10) === today).length;
    const favoriteCount = generations.filter((item) => item.is_favorite).length;
    const latestGenerations = generations.slice(0, 3);
    const savedSettings = [
        ['使うSNS', user.sns_platform || '未設定'],
        ['目的', user.sns_goal || '未設定'],
        ['投稿ジャンル', user.posting_genre || '未設定'],
        ['現在のプラン', user.is_premium ? 'Premium' : 'Free'],
    ];

    const updateProfile = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                sns_platform: snsPlatform,
                sns_goal: snsGoal,
                posting_genre: postingGenre,
            }),
        });
        const data = await response.json();

        if (response.ok) {
            onUserUpdate(data.user);
            setStatus('プロフィールを保存しました。生成精度のチューニングに使われます。');
        } else {
            setStatus(data.message || '保存に失敗しました。');
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="マイページ" />
            <main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <p className="text-sm font-black text-[#e9471b]">Account</p>
                    <h1 className="mt-2 text-5xl font-black tracking-tight">契約と運用設定</h1>
                    <div className="mt-8 rounded-lg border-2 border-black bg-white p-6 shadow-[8px_8px_0_#171717]">
                        <p className="text-sm font-black text-neutral-500">現在のプラン</p>
                        <p className="mt-2 text-3xl font-black">{user.is_premium ? 'Premium' : 'Free'}</p>
                        <p className="mt-3 leading-7 text-neutral-600">
                            {user.is_premium
                                ? `Premium開始日: ${user.premium_started_at ? new Date(user.premium_started_at).toLocaleDateString('ja-JP') : '登録済み'}`
                                : '無料プランは1日3回まで生成できます。'}
                        </p>
                        {user.is_premium ? (
                            <a href="/cancel-policy" className="mt-5 inline-flex rounded-full bg-neutral-100 px-5 py-3 font-black">
                                解約・返金ポリシーを見る
                            </a>
                        ) : (
                            <button onClick={onCheckout} className="mt-5 rounded-full bg-[#ffcf24] px-6 py-3 font-black text-black shadow-[0_4px_0_#171717]">
                                Premiumにアップグレード
                            </button>
                        )}
                    </div>

                    <section className="mt-8 rounded-lg border border-black/10 bg-white p-6">
                        <h2 className="text-2xl font-black">保存済みの運用設定</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {savedSettings.map(([label, value]) => (
                                <div key={label} className="rounded-md bg-[#f7f4ee] p-4">
                                    <p className="text-xs font-black text-neutral-500">{label}</p>
                                    <p className="mt-2 text-lg font-black">{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-8 rounded-lg border border-black/10 bg-white p-6">
                        <h2 className="text-2xl font-black">利用状況</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <StatBox label="本日の生成" value={user.is_premium ? `${todayCount} 回` : `${todayCount} / 3 回`} />
                            <StatBox label="累計生成" value={`${generations.length} 件`} />
                            <StatBox label="お気に入り" value={`${favoriteCount} 件`} />
                        </div>
                        {!user.is_premium && (
                            <div className="mt-5">
                                <div className="mb-2 flex justify-between text-sm font-black">
                                    <span>無料枠</span>
                                    <span>{todayCount} / 3 回</span>
                                </div>
                                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                                    <div className="h-3 rounded-full bg-[#e9471b]" style={{ width: `${Math.min(100, (todayCount / 3) * 100)}%` }} />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
                <div className="space-y-8">
                    <form onSubmit={updateProfile} className="rounded-lg border border-black/10 bg-white p-6">
                        <h2 className="text-2xl font-black">投稿設定を編集</h2>
                        <p className="mt-2 leading-7 text-neutral-600">ここを設定すると、生成時の文体や目的が合わせやすくなります。</p>
                        <div className="mt-6 space-y-5">
                            <label className="block">
                                <span className="text-sm font-bold text-neutral-700">使うSNS</span>
                                <select value={snsPlatform} onChange={(e) => setSnsPlatform(e.target.value)} className="mt-2 block w-full rounded-md border border-black/15 bg-white p-3">
                                    <option>X</option>
                                    <option>Instagram</option>
                                    <option>TikTok</option>
                                    <option>LINE</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-neutral-700">目的</span>
                                <select value={snsGoal} onChange={(e) => setSnsGoal(e.target.value)} className="mt-2 block w-full rounded-md border border-black/15 bg-white p-3">
                                    <option>集客したい</option>
                                    <option>販売したい</option>
                                    <option>フォロワーを増やしたい</option>
                                    <option>LINE登録を増やしたい</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-neutral-700">投稿ジャンル</span>
                                <input value={postingGenre} onChange={(e) => setPostingGenre(e.target.value)} className="mt-2 block w-full rounded-md border border-black/15 p-3" />
                            </label>
                            {status && <div className="rounded-md bg-[#fff8d6] p-3 text-sm font-bold">{status}</div>}
                            <button className="w-full rounded-full bg-[#171717] px-6 py-4 font-black text-white">保存する</button>
                        </div>
                    </form>

                    <section className="rounded-lg border border-black/10 bg-white p-6">
                        <h2 className="text-2xl font-black">最近の生成履歴</h2>
                        <div className="mt-5 space-y-3">
                            {latestGenerations.length > 0 ? latestGenerations.map((item) => (
                                <article key={item.id} className="rounded-md bg-[#f7f4ee] p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="font-black">{item.theme}</p>
                                        {item.is_favorite && <span className="rounded-full bg-[#ffcf24] px-3 py-1 text-xs font-black">お気に入り</span>}
                                    </div>
                                    {(item.empathy_score || item.save_score || item.action_score) && (
                                        <p className="mt-2 text-xs font-bold text-neutral-500">
                                            共感 {item.empathy_score || '-'} / 保存 {item.save_score || '-'} / 導線 {item.action_score || '-'}
                                        </p>
                                    )}
                                </article>
                            )) : (
                                <p className="rounded-md bg-[#f7f4ee] p-5 text-center font-bold text-neutral-400">まだ生成履歴がありません。</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

function StatBox({ label, value }) {
    return (
        <div className="rounded-md bg-[#f7f4ee] p-4">
            <p className="text-xs font-black text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
        </div>
    );
}

function AdminInquiries({ user }) {
    const [inquiries, setInquiries] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!user?.is_admin) {
            setLoaded(true);
            return;
        }

        fetch(`/api/contact-inquiries?user_id=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setInquiries(data.inquiries || []);
                setLoaded(true);
            });
    }, [user]);

    if (!user?.is_admin) {
        return <AccountRequired label="お問い合わせ管理" message="管理者ユーザーのみ閲覧できます。" />;
    }

    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="お問い合わせ管理" />
            <main className="mx-auto max-w-7xl px-5 py-12">
                <p className="text-sm font-black text-[#e9471b]">Admin</p>
                <h1 className="mt-2 text-5xl font-black tracking-tight">お問い合わせ一覧</h1>
                <div className="mt-8 grid gap-4">
                    {!loaded && <p className="font-bold text-neutral-500">読み込み中...</p>}
                    {inquiries.map((item) => (
                        <article key={item.id} className="rounded-lg border border-black/10 bg-white p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="font-black">{item.name} / {item.email}</h2>
                                <span className="rounded-full bg-[#ffcf24] px-3 py-1 text-xs font-black">{item.category}</span>
                            </div>
                            <p className="mt-3 whitespace-pre-wrap leading-7 text-neutral-700">{item.message}</p>
                        </article>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

function ThanksPage({ user }) {
    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="登録完了" />
            <main className="mx-auto max-w-4xl px-5 py-16 text-center">
                <p className="text-sm font-black text-[#e9471b]">Premium</p>
                <h1 className="mt-2 text-5xl font-black tracking-tight">Premium登録ありがとうございます。</h1>
                <p className="mx-auto mt-5 max-w-2xl leading-8 text-neutral-700">
                    まずは販売導線テンプレートかバズ狙いテンプレートを使って、いつもの投稿テーマを伸びる投稿に変えてみましょう。
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a href="/" className="rounded-full bg-[#ffcf24] px-7 py-4 font-black text-black shadow-[0_5px_0_#171717]">
                        投稿を作る
                    </a>
                    <a href="/guide" className="rounded-full bg-white px-7 py-4 font-black text-black">
                        使い方を見る
                    </a>
                </div>
                {user && <p className="mt-6 text-sm font-bold text-neutral-500">{user.name} さんのPremium機能が有効になりました。</p>}
            </main>
            <SiteFooter />
        </div>
    );
}

function SeoPage({ content }) {
    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label={content.label} />
            <main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                    <p className="text-sm font-black text-[#e9471b]">{content.label}</p>
                    <h1 className="mt-2 text-5xl font-black tracking-tight">{content.title}</h1>
                    <p className="mt-5 leading-8 text-neutral-700">{content.lead}</p>
                    <a href="/" className="mt-8 inline-flex rounded-full bg-[#ffcf24] px-7 py-4 font-black text-black shadow-[0_5px_0_#171717]">
                        無料で試す
                    </a>
                </div>
                <div className="rounded-lg border-2 border-black bg-white p-6 shadow-[10px_10px_0_#171717]">
                    {content.points.map((point) => (
                        <div key={point} className="border-b border-black/10 py-5 last:border-b-0">
                            <h2 className="text-xl font-black">{point}</h2>
                        </div>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

function AccountRequired({ label, message = 'ログイン後に表示できます。' }) {
    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label={label} />
            <main className="mx-auto max-w-3xl px-5 py-16 text-center">
                <h1 className="text-4xl font-black">{message}</h1>
                <a href="/" className="mt-8 inline-flex rounded-full bg-[#ffcf24] px-7 py-4 font-black text-black shadow-[0_5px_0_#171717]">
                    トップへ戻る
                </a>
            </main>
            <SiteFooter />
        </div>
    );
}

function ContactPage() {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactCategory, setContactCategory] = useState('Premiumプランについて');
    const [contactMessage, setContactMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const submitContact = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: contactName,
                    email: contactEmail,
                    category: contactCategory,
                    message: contactMessage,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setStatus(data.message || 'お問い合わせを受け付けました。');
                setContactName('');
                setContactEmail('');
                setContactCategory('Premiumプランについて');
                setContactMessage('');
            } else {
                setStatus(data.message || '入力内容を確認してください。');
            }
        } catch (error) {
            setStatus('送信に失敗しました。時間をおいてもう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="お問い合わせ" />
            <main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <p className="text-sm font-black text-[#e9471b]">Contact</p>
                    <h1 className="mt-2 text-5xl font-black tracking-tight">お問い合わせ</h1>
                    <p className="mt-5 leading-8 text-neutral-700">
                        ご利用方法、Premiumプラン、決済、法人利用の相談などはこちらからご連絡ください。
                        通常1〜3営業日以内の返信を目安にしています。
                    </p>
                    <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
                        <p className="text-sm font-black text-neutral-500">返信先メールアドレス</p>
                        <p className="mt-2 font-black">{operatorInfo.email}</p>
                        <p className="mt-3 text-sm leading-6 text-neutral-500">
                            お問い合わせ内容はフォーム送信後、このメールアドレス宛に通知されます。
                        </p>
                    </div>
                </div>

                <form onSubmit={submitContact} className="rounded-lg border-2 border-black bg-white p-6 shadow-[10px_10px_0_#171717]">
                    <div className="space-y-5">
                        <label className="block">
                            <span className="text-sm font-bold text-neutral-700">お名前</span>
                            <input
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-neutral-700">メールアドレス</span>
                            <input
                                required
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-neutral-700">お問い合わせ種別</span>
                            <select
                                value={contactCategory}
                                onChange={(e) => setContactCategory(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-black/15 bg-white p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                            >
                                <option>Premiumプランについて</option>
                                <option>決済・請求について</option>
                                <option>使い方について</option>
                                <option>法人利用について</option>
                                <option>その他</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-neutral-700">お問い合わせ内容</span>
                            <textarea
                                required
                                rows="7"
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-black/15 p-3 outline-none focus:border-[#e9471b] focus:ring-2 focus:ring-[#e9471b]/20"
                            />
                        </label>
                        {status && <div className="rounded-md bg-[#fff8d6] p-3 text-sm font-bold">{status}</div>}
                        <button
                            disabled={loading}
                            className="w-full rounded-full bg-[#171717] px-6 py-4 text-base font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? '送信中...' : 'お問い合わせを送信する'}
                        </button>
                    </div>
                </form>
            </main>
            <SiteFooter />
        </div>
    );
}

function PricingPage() {
    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="料金" />
            <main className="mx-auto max-w-7xl px-5 py-12">
                <p className="text-sm font-black text-[#e9471b]">Pricing</p>
                <h1 className="mt-2 max-w-3xl text-5xl font-black tracking-tight">まず無料。毎日使うならPremium。</h1>
                <p className="mt-5 max-w-2xl leading-8 text-neutral-700">
                    無料プランで投稿生成を試し、SNS運用に使えると感じたらPremiumで無制限に制作できます。
                </p>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <PlanCard name="Free" price="0円" description="まず試したい人向け" items={['1日3回まで生成', '通常投稿テンプレート', '履歴保存', '基本的な投稿制作']} />
                    <PlanCard name="Premium" price="決済画面で表示" description="毎日SNS運用したい人向け" highlight items={['生成回数無制限', 'バズ狙いテンプレート', '販売導線テンプレート', 'LINE誘導テンプレート', '炎上回避テンプレート', 'スコア改善導線']} />
                </div>

                <div className="mt-10 overflow-hidden rounded-lg border-2 border-black bg-white shadow-[10px_10px_0_#171717]">
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
            </main>
            <SiteFooter />
        </div>
    );
}

function GuidePage() {
    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="使い方" />
            <main className="mx-auto max-w-7xl px-5 py-12">
                <p className="text-sm font-black text-[#e9471b]">Guide</p>
                <h1 className="mt-2 max-w-3xl text-5xl font-black tracking-tight">投稿テーマを入れるだけ。運用に使える文章へ。</h1>
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {guideSteps.map(([title, body], index) => (
                        <article key={title} className="rounded-lg border-2 border-black bg-white p-5 shadow-[6px_6px_0_#171717]">
                            <p className="text-sm font-black text-[#e9471b]">STEP {index + 1}</p>
                            <h2 className="mt-2 text-xl font-black">{title}</h2>
                            <p className="mt-3 leading-7 text-neutral-600">{body}</p>
                        </article>
                    ))}
                </div>
                <section className="mt-12 rounded-lg border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-black">入力のコツ</h2>
                    <ul className="mt-4 space-y-3 font-bold text-neutral-700">
                        <li>誰に向けた投稿かを書く</li>
                        <li>売りたい商品や案内したい行動を書く</li>
                        <li>投稿のトーンを指定する</li>
                        <li>キャンペーンや期限がある場合は入れる</li>
                    </ul>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}

function SamplesPage() {
    return (
        <div className="min-h-screen bg-[#f7f4ee] text-[#171717]">
            <PageHeader label="サンプル投稿" />
            <main className="mx-auto max-w-7xl px-5 py-12">
                <p className="text-sm font-black text-[#e9471b]">Samples</p>
                <h1 className="mt-2 max-w-3xl text-5xl font-black tracking-tight">Before / Afterで分かる、投稿の変わり方。</h1>
                <div className="mt-10 grid gap-6">
                    {samples.map((sample) => (
                        <article key={sample.type} className="rounded-lg border-2 border-black bg-white p-6 shadow-[10px_10px_0_#171717]">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-[#ffcf24] px-3 py-1 text-xs font-black">{sample.type}</span>
                                <h2 className="text-xl font-black">{sample.theme}</h2>
                            </div>
                            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <div className="rounded-md bg-neutral-100 p-5">
                                    <p className="text-xs font-black text-neutral-500">Before</p>
                                    <p className="mt-3 leading-7">{sample.before}</p>
                                </div>
                                <div className="rounded-md bg-[#171717] p-5 text-white">
                                    <p className="text-xs font-black text-white/50">After</p>
                                    <p className="mt-3 leading-7">{sample.after}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}

function PlanCard({ name, price, description, items, highlight = false }) {
    return (
        <article className={`rounded-lg border-2 p-6 ${highlight ? 'border-black bg-[#ffcf24] shadow-[10px_10px_0_#171717]' : 'border-black/10 bg-white'}`}>
            <p className="text-sm font-black text-neutral-600">{description}</p>
            <h2 className="mt-2 text-4xl font-black">{name}</h2>
            <p className="mt-3 text-2xl font-black">{price}</p>
            <ul className="mt-6 space-y-3 font-bold">
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </article>
    );
}

function PageHeader({ label }) {
    return (
        <header className="border-b border-black/10 bg-[#fffdf8] px-5 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <a href="/" className="text-xl font-black tracking-tight">
                    SNS Buzz Maker
                </a>
                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black">{label}</span>
            </div>
        </header>
    );
}
