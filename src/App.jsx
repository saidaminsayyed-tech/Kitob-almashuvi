import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const ADMIN_HASH = '1d5ccc6cf7394902632b651bf8f61e7ec32fb8e5d6bf94c6054e850e822a03ac'
const STATUSES = ['pending', 'approved', 'rejected', 'done']
const LANGUAGES = { uz: "O'zbekcha", en: 'English', ru: 'Русский' }
const TEXT = {
  uz: { catalog: 'Katalog', add: "E'lon qo'shish", profile: 'Profilim', admin: 'Admin panel', signin: 'Kirish', signout: 'Chiqish', catalogTitle: 'Kitoblar katalogi', search: "Nom yoki muallif bo'yicha qidirish", all: 'Barchasi', emptyCatalog: "Hozircha tasdiqlangan e'lonlar yo'q.", details: 'Batafsil', exchange: 'Almashtirish', sale: 'Sotish', pending: 'Kutilmoqda', approved: 'Tasdiqlandi', rejected: 'Rad etildi', done: 'Yakunlandi', login: 'Tizimga kirish', register: "Ro'yxatdan o'tish", name: 'Ismingiz', email: 'Email', password: 'Parol', addTitle: "Yangi e'lon", type: "E'lon turi", book: 'Kitob nomi', author: 'Muallifi', description: 'Tavsif', descriptionHint: 'Holati, nashr yili, nimaga almashtirmoqchisiz...', price: "Narxi (so'm)", photo: 'Kitob rasmi', submit: 'Moderatsiyaga yuborish', moderationNote: "E'lon admin tasdiqlagandan so'ng katalogda ko'rinadi.", myListings: "Mening e'lonlarim", noListings: "Sizda hali e'lon yo'q.", adminTitle: 'Admin panel — moderatsiya', postedBy: 'E’lon egasi', approve: 'Tasdiqlash', reject: 'Rad etish', reason: 'Rad etish sababi', cancel: 'Bekor qilish', close: 'Yopish', noDescription: "Tavsif yo'q", loginRequired: 'Bu bo‘limga kirish uchun avval tizimga kiring.', signInUp: "Kirish / Ro'yxatdan o'tish", noStatus: "Bu holatda e'lonlar yo'q.", markDone: 'Yakunlandi deb belgilash', delete: "O'chirish", create: 'Akkaunt yaratish', haveAccount: 'Akkauntim bor', wrongAuth: 'Email yoki parol noto‘g‘ri', error: 'Xatolik yuz berdi', owner: 'Muallif', contactLogin: '(aloqa uchun tizimga kiring)', adminLogin: 'Admin kirishi', adminButton: 'Admin sifatida kirish', adminError: 'Admin ismi yoki paroli noto‘g‘ri', reasonHint: 'Masalan: rasm sifatsiz, tavsif to‘liq emas', noReason: 'ko‘rsatilmagan', allTypes: 'Barchasi', empty: 'Hozircha e’lon yo‘q', authHint: 'Yangi akkaunt yaratish uchun ro‘yxatdan o‘ting.', themeMorning: 'Ertalabgi ko‘rinish', themeNight: 'Tungi ko‘rinish' },
  en: { catalog: 'Catalog', add: 'Add listing', profile: 'My profile', admin: 'Admin panel', signin: 'Sign in', signout: 'Sign out', catalogTitle: 'Book catalog', search: 'Search by title or author', all: 'All', emptyCatalog: 'No approved listings yet.', details: 'Details', exchange: 'Exchange', sale: 'Sale', pending: 'Pending', approved: 'Approved', rejected: 'Rejected', done: 'Completed', login: 'Sign in', register: 'Create account', name: 'Your name', email: 'Email', password: 'Password', addTitle: 'New listing', type: 'Listing type', book: 'Book title', author: 'Author', description: 'Description', descriptionHint: 'Condition, edition year, what you want in exchange...', price: 'Price (UZS)', photo: 'Book photo', submit: 'Submit for moderation', moderationNote: 'Your listing appears in the catalog after an admin approves it.', myListings: 'My listings', noListings: "You don't have any listings yet.", adminTitle: 'Admin panel — moderation', postedBy: 'Listed by', approve: 'Approve', reject: 'Reject', reason: 'Rejection reason', cancel: 'Cancel', close: 'Close', noDescription: 'No description', loginRequired: 'Please sign in to access this section.', signInUp: 'Sign in / Sign up', noStatus: 'No listings in this status.', markDone: 'Mark as completed', delete: 'Delete', create: 'Create account', haveAccount: 'I have an account', wrongAuth: 'Wrong email or password', error: 'An error occurred', owner: 'Listed by', contactLogin: '(sign in to contact)', adminLogin: 'Admin sign-in', adminButton: 'Sign in as admin', adminError: 'Wrong admin name or password', reasonHint: 'E.g. poor photo quality, incomplete description', noReason: 'not specified', allTypes: 'All', empty: 'No listings yet', authHint: 'Create an account to get started.', themeMorning: 'Switch to morning theme', themeNight: 'Switch to night theme' },
  ru: { catalog: 'Каталог', add: 'Добавить объявление', profile: 'Мой профиль', admin: 'Админ-панель', signin: 'Войти', signout: 'Выйти', catalogTitle: 'Каталог книг', search: 'Поиск по названию или автору', all: 'Все', emptyCatalog: 'Пока нет одобренных объявлений.', details: 'Подробнее', exchange: 'Обмен', sale: 'Продажа', pending: 'На проверке', approved: 'Одобрено', rejected: 'Отклонено', done: 'Завершено', login: 'Вход', register: 'Регистрация', name: 'Ваше имя', email: 'Email', password: 'Пароль', addTitle: 'Новое объявление', type: 'Тип объявления', book: 'Название книги', author: 'Автор', description: 'Описание', descriptionHint: 'Состояние, год издания, на что хотите обменять...', price: 'Цена (сум)', photo: 'Фото книги', submit: 'Отправить на модерацию', moderationNote: 'Объявление появится в каталоге после одобрения администратором.', myListings: 'Мои объявления', noListings: 'У вас пока нет объявлений.', adminTitle: 'Админ-панель — модерация', postedBy: 'Владелец', approve: 'Одобрить', reject: 'Отклонить', reason: 'Причина отказа', cancel: 'Отмена', close: 'Закрыть', noDescription: 'Нет описания', loginRequired: 'Чтобы открыть этот раздел, войдите в систему.', signInUp: 'Вход / Регистрация', noStatus: 'Нет объявлений с таким статусом.', markDone: 'Отметить как завершённое', delete: 'Удалить', create: 'Создать аккаунт', haveAccount: 'У меня есть аккаунт', wrongAuth: 'Неверный email или пароль', error: 'Произошла ошибка', owner: 'Владелец', contactLogin: '(войдите, чтобы связаться)', adminLogin: 'Вход администратора', adminButton: 'Войти как администратор', adminError: 'Неверное имя или пароль администратора', reasonHint: 'Например: плохое фото, неполное описание', noReason: 'не указана', allTypes: 'Все', empty: 'Пока нет объявлений', authHint: 'Зарегистрируйтесь, чтобы начать.', themeMorning: 'Включить утреннюю тему', themeNight: 'Включить ночную тему' },
}

function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function hash(value) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)).then(bytes => [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join(''))
}
function BookMark({ className = 'h-6 w-6' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('bs_theme') || 'night' } catch { return 'night' }
  })
  const [lang, setLang] = useState(() => localStorage.getItem('bs_lang') || 'uz')
  const [listings, setListings] = useState(() => readStore('bs_listings', []))
  const [accounts, setAccounts] = useState(() => readStore('bs_accounts', []))
  const [me, setMe] = useState(() => readStore('bs_me', null))
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('bs_admin') === '1')
  const [selected, setSelected] = useState(null)
  const [rejecting, setRejecting] = useState(null)
  const [notice, setNotice] = useState('')
  const t = TEXT[lang] || TEXT.uz
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { localStorage.setItem('bs_listings', JSON.stringify(listings)) }, [listings])
  useEffect(() => { localStorage.setItem('bs_accounts', JSON.stringify(accounts)) }, [accounts])
  useEffect(() => { me ? localStorage.setItem('bs_me', JSON.stringify(me)) : localStorage.removeItem('bs_me') }, [me])
  useEffect(() => { localStorage.setItem('bs_lang', lang); document.documentElement.lang = lang }, [lang])
  useEffect(() => { setNotice(''); setSelected(null); setRejecting(null) }, [location.pathname])

  function updateListing(id, changes) {
    setListings(items => items.map(item => item.id === id ? { ...item, ...changes } : item))
  }
  function logout() {
    setMe(null)
    setIsAdmin(false)
    sessionStorage.removeItem('bs_admin')
    navigate('/')
  }
  function switchTheme(event) {
    const nextTheme = theme === 'night' ? 'morning' : 'night'
    document.documentElement.style.setProperty('--theme-x', `${event.clientX}px`)
    document.documentElement.style.setProperty('--theme-y', `${event.clientY}px`)
    const update = () => flushSync(() => {
      document.documentElement.classList.toggle('dark', nextTheme === 'night')
      setTheme(nextTheme)
      try { localStorage.setItem('bs_theme', nextTheme) } catch {}
    })
    if (document.startViewTransition) document.startViewTransition(update)
    else update()
  }

  return <div className="min-h-screen bg-paper text-ink">
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="mr-auto flex items-center gap-2 font-display text-xl font-bold text-rust"><BookMark />BookSwap</Link>
        <nav className="order-3 flex w-full flex-wrap gap-1 sm:order-none sm:w-auto">
          {[[ '/', t.catalog], ['/add', t.add], ['/profile', t.profile]].map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-ink font-semibold text-paper' : 'text-muted hover:bg-hover-surface hover:text-ink'}`}>{label}</NavLink>)}
          <NavLink to="/admin" aria-label={t.admin} title={t.admin} className={({ isActive }) => `inline-flex h-9 w-9 items-center justify-center rounded-md transition ${isActive ? 'bg-ink text-paper' : 'text-muted hover:bg-hover-surface hover:text-ink'}`}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={switchTheme} aria-label={theme === 'night' ? t.themeMorning : t.themeNight} title={theme === 'night' ? t.themeMorning : t.themeNight} className="rounded-md border border-line p-2 hover:border-rust hover:bg-hover-surface" >
            <svg className={`h-4 w-4 transition-transform duration-500 ${theme === 'night' ? 'rotate-0' : 'rotate-180'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {theme === 'night' ? <path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>}
            </svg>
          </button>
          <select aria-label="Language" value={lang} onChange={event => setLang(event.target.value)} className="rounded-md border border-line bg-white px-2 py-2 text-sm">
            {Object.entries(LANGUAGES).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
          {(me || isAdmin) ? <><span className="hidden text-sm text-muted md:inline">{me?.name || 'Amin'} · {isAdmin ? 'Admin' : 'User'}</span><button onClick={logout} className="rounded-md border border-line px-3 py-2 text-sm hover:border-rust hover:bg-hover-surface">{t.signout}</button></> : <Link to="/auth" className="rounded-md bg-rust px-3 py-2 text-sm font-semibold text-white hover:bg-[#963f1e]">{t.signin}</Link>}
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      {notice && <div role="status" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{notice}</div>}
      <Routes>
        <Route path="/" element={<Catalog listings={listings} t={t} lang={lang} onSelect={setSelected} />} />
        <Route path="/auth" element={<Auth t={t} accounts={accounts} setAccounts={setAccounts} onLogin={setMe} setNotice={setNotice} navigate={navigate} />} />
        <Route path="/add" element={<AddListing t={t} lang={lang} me={me} setListings={setListings} setNotice={setNotice} navigate={navigate} />} />
        <Route path="/profile" element={<Profile t={t} me={me} listings={listings} onUpdate={updateListing} onDelete={id => setListings(items => items.filter(item => item.id !== id))} onNeedLogin={() => navigate('/auth')} />} />
        <Route path="/admin" element={<Admin t={t} listings={listings} isAdmin={isAdmin} setIsAdmin={setIsAdmin} onUpdate={updateListing} setRejecting={setRejecting} setNotice={setNotice} />} />
        <Route path="*" element={<Catalog listings={listings} t={t} lang={lang} onSelect={setSelected} />} />
      </Routes>
    </main>
    {selected && <ListingModal listing={selected} me={me} t={t} lang={lang} onClose={() => setSelected(null)} />}
    {rejecting && <RejectModal t={t} onClose={() => setRejecting(null)} onSubmit={reason => { updateListing(rejecting.id, { status: 'rejected', reason: reason || t.noReason }); setRejecting(null) }} />}
  </div>
}

function Badge({ children, tone = 'gray' }) {
  const colors = { gray: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300', blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200', green: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200', yellow: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200', red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[tone]}`}>{children}</span>
}
const statusTone = status => ({ pending: 'yellow', approved: 'green', rejected: 'red', done: 'gray' })[status] || 'gray'
function ListingBadges({ listing, t }) {
  return <div className="flex flex-wrap gap-2"><Badge tone={listing.type === 'sale' ? 'green' : 'blue'}>{listing.type === 'sale' ? t.sale : t.exchange}</Badge><Badge tone={statusTone(listing.status)}>{t[listing.status]}</Badge></div>
}
function Cover({ listing, compact = false }) {
  return <div className={`flex items-center justify-center overflow-hidden bg-[#eee5da] text-[#a28e7b] dark:bg-[#332b23] dark:text-[#a79b8f] ${compact ? 'h-[68px] w-[68px] shrink-0 rounded-md' : 'aspect-[4/3] w-full'}`}>
    {listing.img ? <img src={listing.img} alt={listing.title} className="h-full w-full object-cover" /> : <BookMark className={compact ? 'h-8 w-8' : 'h-14 w-14'} />}
  </div>
}
function Catalog({ listings, t, lang, onSelect }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const visible = useMemo(() => listings.filter(item => item.status === 'approved' && (type === 'all' || item.type === type) && `${item.title} ${item.author}`.toLowerCase().includes(query.toLowerCase())), [listings, query, type])
  return <>
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-end">
      <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-rust">BookSwap</p><h1 className="font-display text-3xl font-bold sm:text-4xl">{t.catalogTitle}</h1></div>
      <p className="text-sm text-muted">{visible.length} {lang === 'ru' ? 'объявлений' : lang === 'en' ? 'listings' : "ta e'lon"}</p>
    </div>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-rust" />
      <select value={type} onChange={event => setType(event.target.value)} className="rounded-md border border-line bg-white px-3 py-2.5 sm:w-56"><option value="all">{t.allTypes}</option><option value="exchange">{t.exchange}</option><option value="sale">{t.sale}</option></select>
    </div>
    {visible.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map(listing => <article key={listing.id} className="group overflow-hidden rounded-lg border border-line bg-white transition hover:-translate-y-0.5 hover:border-rust hover:bg-hover-surface hover:shadow-md">
      <Cover listing={listing} /><div className="flex min-h-44 flex-col p-4"><Badge tone={listing.type === 'sale' ? 'green' : 'blue'}>{listing.type === 'sale' ? t.sale : t.exchange}</Badge><h2 className="mt-3 line-clamp-2 font-display text-lg font-bold">{listing.title}</h2><p className="mt-1 text-sm text-muted">{listing.author}</p>{listing.type === 'sale' && <p className="mt-2 font-semibold">{Number(listing.price || 0).toLocaleString(lang)} {lang === 'uz' ? "so'm" : lang === 'ru' ? 'сум' : 'UZS'}</p>}<button onClick={() => onSelect(listing)} className="mt-auto pt-4 text-left text-sm font-semibold text-rust hover:underline">{t.details} <span aria-hidden="true">→</span></button></div>
    </article>)}</div> : <div className="py-20 text-center text-muted">{t.emptyCatalog}</div>}
  </>
}
function Auth({ t, accounts, setAccounts, onLogin, setNotice, navigate }) {
  const [register, setRegister] = useState(false)
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setNotice(''); setBusy(true)
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim().toLowerCase()
    const password = String(form.get('password') || '')
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6 || (register && !name)) { setNotice(register && !name ? t.name : 'Email va kamida 6 belgili parol kiriting.'); setBusy(false); return }
    try {
      const account = accounts.find(item => item.email === email)
      if (register) {
        if (account) { setNotice('Bu email allaqachon ro‘yxatdan o‘tgan.'); setBusy(false); return }
        const salt = crypto.randomUUID()
        const created = { email, name, salt, hash: await hash(salt + password) }
        setAccounts(items => [...items, created]); onLogin({ email, name })
      } else {
        if (!account || account.hash !== await hash(account.salt + password)) { setNotice(t.wrongAuth); setBusy(false); return }
        onLogin({ email, name: account.name })
      }
      navigate('/')
    } catch { setNotice(t.error) }
    setBusy(false)
  }
  return <section className="mx-auto max-w-md rounded-lg border border-line bg-white p-6 sm:p-8"><h1 className="font-display text-2xl font-bold">{register ? t.register : t.login}</h1><p className="mt-2 text-sm text-muted">{t.authHint}</p>
    <form onSubmit={submit} className="mt-5 space-y-4">{register && <Field label={t.name} name="name" required />}<Field label={t.email} name="email" type="email" required /><Field label={t.password} name="password" type="password" minLength={6} required /><div className="flex flex-wrap gap-2 pt-2"><button disabled={busy} className="rounded-md bg-rust px-4 py-2.5 font-semibold text-white hover:bg-[#963f1e] disabled:opacity-60">{busy ? '...' : register ? t.create : t.signin}</button><button type="button" onClick={() => setRegister(value => !value)} className="rounded-md border border-line px-4 py-2.5 hover:border-rust hover:bg-hover-surface">{register ? t.haveAccount : t.create}</button></div></form>
  </section>
}
function Field({ label, name, ...props }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} {...props} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 font-normal outline-none focus:border-rust" /></label>
}
function AddListing({ t, lang, me, setListings, setNotice, navigate }) {
  const [type, setType] = useState('exchange')
  const [image, setImage] = useState('')
  const [busy, setBusy] = useState(false)
  if (!me) return <NeedLogin t={t} />
  async function imageToData(file) {
    if (!file) { setImage(''); return }
    const reader = new FileReader()
    reader.onload = () => {
      const source = new Image()
      source.onload = () => {
        const scale = Math.min(1, 520 / Math.max(source.width, source.height))
        const canvas = document.createElement('canvas')
        canvas.width = source.width * scale; canvas.height = source.height * scale
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height)
        setImage(canvas.toDataURL('image/jpeg', 0.72))
      }
      source.src = reader.result
    }
    reader.readAsDataURL(file)
  }
  function submit(event) {
    event.preventDefault(); setNotice(''); setBusy(true)
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') || '').trim(), author = String(data.get('author') || '').trim()
    if (!title || !author) { setNotice('Kitob nomi va muallifini kiriting.'); setBusy(false); return }
    const listing = { id: crypto.randomUUID(), type, title, author, desc: String(data.get('description') || '').trim(), price: type === 'sale' ? Number(data.get('price') || 0) : 0, img: image, lang, status: 'pending', reason: '', ownerEmail: me.email, ownerName: me.name, createdAt: Date.now() }
    setListings(items => [listing, ...items]); navigate('/profile'); setBusy(false)
  }
  return <section className="max-w-2xl"><h1 className="mb-5 font-display text-3xl font-bold">{t.addTitle}</h1><form onSubmit={submit} className="rounded-lg border border-line bg-white p-5 sm:p-7">
    <span className="block text-sm font-semibold">{t.type}</span><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => setType('exchange')} className={`rounded-md border px-3 py-2.5 text-sm font-semibold ${type === 'exchange' ? 'border-rust bg-rust text-white' : 'border-line hover:border-rust hover:bg-hover-surface'}`}>{t.exchange}</button><button type="button" onClick={() => setType('sale')} className={`rounded-md border px-3 py-2.5 text-sm font-semibold ${type === 'sale' ? 'border-rust bg-rust text-white' : 'border-line hover:border-rust hover:bg-hover-surface'}`}>{t.sale}</button></div>
    <div className="mt-4 space-y-4"><Field label={t.book} name="title" required /><Field label={t.author} name="author" required /><label className="block text-sm font-semibold">{t.description}<textarea name="description" rows="4" placeholder={t.descriptionHint} className="mt-1.5 block w-full resize-y rounded-md border border-line bg-paper px-3 py-2.5 font-normal outline-none focus:border-rust" /></label>{type === 'sale' && <Field label={t.price} name="price" type="number" min="0" />}
      <label className="block text-sm font-semibold">{t.photo}<input type="file" accept="image/*" onChange={event => imageToData(event.target.files?.[0])} className="mt-1.5 block w-full rounded-md border border-line bg-paper p-2 text-sm font-normal file:mr-3 file:rounded file:border-0 file:bg-[#eee5da] file:px-3 file:py-1.5" /></label>{image && <img src={image} alt="Kitob rasmi" className="h-28 w-36 rounded-md object-cover" />}</div>
    <p className="my-4 text-sm text-muted">{t.moderationNote}</p><button disabled={busy} className="rounded-md bg-rust px-4 py-2.5 font-semibold text-white hover:bg-[#963f1e] disabled:opacity-60">{t.submit}</button>
  </form></section>
}
function NeedLogin({ t }) {
  return <div className="rounded-lg border border-line bg-white p-6">{t.loginRequired} <Link to="/auth" className="ml-2 inline-block rounded-md bg-rust px-3 py-2 text-sm font-semibold text-white">{t.signInUp}</Link></div>
}
function Profile({ t, me, listings, onUpdate, onDelete, onNeedLogin }) {
  if (!me) return <div className="rounded-lg border border-line bg-white p-6">{t.loginRequired} <button onClick={onNeedLogin} className="ml-2 rounded-md bg-rust px-3 py-2 text-sm font-semibold text-white">{t.signInUp}</button></div>
  const mine = listings.filter(item => item.ownerEmail === me.email)
  return <><h1 className="font-display text-3xl font-bold">{t.myListings}</h1><p className="mb-6 mt-2 text-sm text-muted">{me.name} · {me.email}</p>{mine.length ? <div className="space-y-3">{mine.map(item => <div key={item.id} className="flex flex-wrap items-start gap-4 rounded-lg border border-line bg-white p-4"><Cover listing={item} compact /><div className="min-w-[180px] flex-1"><ListingBadges listing={item} t={t} /><h2 className="mt-2 font-display text-lg font-bold">{item.title}</h2><p className="text-sm text-muted">{item.author}{item.type === 'sale' && ` · ${Number(item.price || 0).toLocaleString()} UZS`}</p>{item.status === 'rejected' && <p className="mt-2 text-sm text-red-700">{t.reason}: {item.reason || t.noReason}</p>}</div><div className="flex flex-wrap gap-2">{item.status === 'approved' && <button onClick={() => onUpdate(item.id, { status: 'done' })} className="rounded-md border border-line px-3 py-2 text-sm hover:border-rust hover:bg-hover-surface">{t.markDone}</button>}<button onClick={() => onDelete(item.id)} className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-100 dark:hover:bg-red-950">{t.delete}</button></div></div>)}</div> : <p className="py-16 text-center text-muted">{t.noListings}</p>}</>
}
function Admin({ t, listings, isAdmin, setIsAdmin, onUpdate, setRejecting, setNotice }) {
  const [tab, setTab] = useState('pending')
  async function login(event) {
    event.preventDefault(); setNotice('')
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim().toLowerCase(), password = String(data.get('password') || '')
    if (await hash(`bs-admin:${name}:${password}`) !== ADMIN_HASH) { setNotice(t.adminError); return }
    sessionStorage.setItem('bs_admin', '1'); setIsAdmin(true)
  }
  if (!isAdmin) return <section className="mx-auto max-w-md rounded-lg border border-line bg-white p-6"><h1 className="font-display text-2xl font-bold">{t.adminLogin}</h1><form onSubmit={login} className="mt-5 space-y-4"><Field label={t.name} name="name" autoComplete="off" required /><Field label={t.password} name="password" type="password" autoComplete="off" required /><button className="rounded-md bg-rust px-4 py-2.5 font-semibold text-white">{t.adminButton}</button></form></section>
  const count = status => listings.filter(item => item.status === status).length
  const filtered = listings.filter(item => item.status === tab)
  return <><h1 className="mb-5 font-display text-3xl font-bold">{t.adminTitle}</h1><div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{STATUSES.map(status => <div key={status} className="rounded-lg border border-line bg-white px-4 py-3"><b className="block text-2xl">{count(status)}</b><span className="text-sm text-muted">{t[status]}</span></div>)}</div><div className="mb-4 flex flex-wrap gap-2">{STATUSES.map(status => <button key={status} onClick={() => setTab(status)} className={`rounded-md px-3 py-2 text-sm font-semibold ${tab === status ? 'bg-ink text-white' : 'border border-line bg-white'}`}>{t[status]}</button>)}</div>
    {filtered.length ? <div className="space-y-3">{filtered.map(item => <div key={item.id} className="flex flex-wrap items-start gap-4 rounded-lg border border-line bg-white p-4"><Cover listing={item} compact /><div className="min-w-[200px] flex-1"><ListingBadges listing={item} t={t} /><h2 className="mt-2 font-display text-lg font-bold">{item.title} <span className="font-sans text-sm font-normal text-muted">— {item.author}</span></h2><p className="mt-1 text-sm text-muted">{item.desc}</p><p className="mt-2 text-xs text-muted">{t.postedBy}: {item.ownerName} ({item.ownerEmail})</p>{item.status === 'rejected' && <p className="mt-1 text-sm text-muted">{t.reason}: {item.reason}</p>}</div><div className="flex flex-wrap gap-2">{item.status !== 'approved' && item.status !== 'done' && <button onClick={() => onUpdate(item.id, { status: 'approved', reason: '' })} className="rounded-md bg-rust px-3 py-2 text-sm font-semibold text-white">{t.approve}</button>}{item.status !== 'rejected' && item.status !== 'done' && <button onClick={() => setRejecting(item)} className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700">{t.reject}</button>}</div></div>)}</div> : <p className="py-16 text-center text-muted">{t.noStatus}</p>}
  </>
}
function ListingModal({ listing, me, t, lang, onClose }) {
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-lg bg-white p-5 shadow-xl sm:p-6">{listing.img && <img src={listing.img} alt={listing.title} className="mb-4 max-h-64 w-full rounded-md object-cover" />}<Badge tone={listing.type === 'sale' ? 'green' : 'blue'}>{listing.type === 'sale' ? t.sale : t.exchange}</Badge><h2 className="mt-3 font-display text-2xl font-bold">{listing.title}</h2><p className="text-sm text-muted">{listing.author}</p><p className="my-4 whitespace-pre-wrap">{listing.desc || t.noDescription}</p>{listing.type === 'sale' && <p className="mb-4 font-semibold">{Number(listing.price || 0).toLocaleString(lang)} UZS</p>}<p className="mb-5 text-sm text-muted">{t.owner}: {listing.ownerName}{me ? <> · <a className="text-rust underline" href={`mailto:${listing.ownerEmail}`}>{listing.ownerEmail}</a></> : ` ${t.contactLogin}`}</p><button onClick={onClose} className="rounded-md border border-line px-4 py-2 hover:border-rust hover:bg-hover-surface">{t.close}</button></section></div>
}
function RejectModal({ t, onClose, onSubmit }) {
  const [reason, setReason] = useState('')
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><form onSubmit={event => { event.preventDefault(); onSubmit(reason.trim()) }} className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"><h2 className="mb-3 font-display text-xl font-bold">{t.reason}</h2><textarea autoFocus rows="3" value={reason} onChange={event => setReason(event.target.value)} placeholder={t.reasonHint} className="w-full rounded-md border border-line bg-paper p-3 outline-none focus:border-rust" /><div className="mt-4 flex gap-2"><button className="rounded-md bg-rust px-4 py-2 font-semibold text-white">{t.reject}</button><button type="button" onClick={onClose} className="rounded-md border border-line px-4 py-2">{t.cancel}</button></div></form></div>
}