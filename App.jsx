import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Activity, ArrowDownUp, ArrowLeft, ArrowRight, Bell, Bookmark, CalendarDays, Camera, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Clock3,
  Copy, Download, ExternalLink, Eye, Filter, LayoutDashboard, LogOut, Menu, MoreHorizontal,
  Package, Plus, Printer, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Star,
  Sun, Moon, Laptop, Users, X, QrCode, Zap, Boxes, ChartNoAxesCombined, RotateCcw, Wrench,
  ArrowUpRight, CircleAlert, CheckCheck, CircleX, Headphones, Speaker, Lightbulb, Cpu,
  Monitor, Dumbbell, Mic2, Clapperboard, Pencil, Trash2, MapPin, TicketCheck,
} from 'lucide-react'
import {
  categories, isActiveBooking, localDate, makeDemoBookings, makeId, overlaps, resources as seedResources, societies,
} from './data'
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

const STORAGE_KEY = 'campusvault-prototype-v1'
const today = localDate(new Date())
const currentStudent = 'Ananya Sharma'
const categoryTabs = ['All Gear', ...categories]
const times = ['9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM']
const statusNames = {
  pending: 'Pending approval', approved: 'Approved', checked_out: 'Checked out', overdue: 'Overdue',
  returned: 'Returned', rejected: 'Rejected', cancelled: 'Cancelled',
}
const statusClass = (status) => `status status-${status}`
const displayDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const daysFromToday = (offset) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return localDate(date)
}

function readStore() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (stored?.resources && stored?.bookings) return stored
  } catch (error) {
    console.warn('CampusVault demo data could not be loaded; starting with sample data.', error)
  }
  return { resources: seedResources, bookings: makeDemoBookings(), saved: [], notifications: [], activity: [] }
}

function getAvailability(resource, bookings, startDate, endDate, excludingId) {
  if (!startDate || !endDate || startDate > endDate) return Math.max(0, resource.total - (resource.maintenance || 0))
  const active = bookings.filter((booking) => booking.resourceId === resource.id
    && booking.id !== excludingId && isActiveBooking(booking)
    && overlaps(startDate, endDate, booking.startDate, booking.endDate))
  let minimum = resource.total - (resource.maintenance || 0)
  const cursor = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  while (cursor <= end) {
    const day = localDate(cursor)
    const reserved = active.filter((booking) => day >= booking.startDate && day <= booking.endDate)
      .reduce((sum, booking) => sum + Number(booking.quantity || 0), 0)
    minimum = Math.min(minimum, resource.total - (resource.maintenance || 0) - reserved)
    cursor.setDate(cursor.getDate() + 1)
  }
  return Math.max(0, minimum)
}

function useVault() {
  const [store, setStore] = useState(readStore)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) }
    catch (error) { console.error('CampusVault could not save demo data to LocalStorage.', error) }
  }, [store])
  const update = (key, value) => setStore((current) => ({ ...current, [key]: typeof value === 'function' ? value(current[key]) : value }))
  const addNotice = (message, bookingId, audience = 'all') => update('notifications', (all) => [{
    id: `${Date.now()}-${Math.random()}`, message, bookingId, audience, read: false, createdAt: new Date().toISOString(),
  }, ...all])
  const addActivity = (message, society) => update('activity', (all) => [{
    id: `${Date.now()}-${Math.random()}`, message, society, createdAt: new Date().toISOString(),
  }, ...all].slice(0, 40))
  return { ...store, setStore, update, addNotice, addActivity }
}

function ProductArt({ item, large = false }) {
  const type = item?.art || 'Camera'
  const Icon = type === 'Camera' ? Camera : type === 'Mic' ? Mic2 : type === 'Speaker' ? Speaker
    : type === 'Headphones' ? Headphones : type === 'Light' ? Lightbulb : type === 'Monitor' || type === 'Projector' ? Monitor
      : type === 'Ball' || type === 'Racket' ? Dumbbell : type === 'Board' || type === 'Robot' ? Cpu : Clapperboard
  const palette = item?.category === 'Robotics & Hardware' ? ['#dff4e9', '#1a885e']
    : item?.category === 'Audio & Sound' ? ['#e7e8ff', '#6359aa']
      : item?.category === 'Stage Props & Lights' ? ['#fff0de', '#ce7b32']
        : item?.category === 'Computing' ? ['#e2f2f6', '#37869a']
          : item?.category === 'Sports & Recreation' ? ['#e1f3e7', '#408858'] : ['#fbe7e9', '#bc6670']
  return (
    <div className={`product-art ${large ? 'product-art-large' : ''}`} style={{ '--art-bg': palette[0], '--art-ink': palette[1] }} aria-label={`${item?.name || 'Equipment'} illustration`}>
      <div className="art-glow" />
      <div className="art-product"><Icon strokeWidth={1.35} /></div>
      <span className="art-shadow" />
      <span className="art-spark art-spark-one" /><span className="art-spark art-spark-two" />
    </div>
  )
}

function VaultIllustration() {
  return (
    <div className="vault-illustration" aria-label="Illustration of shared campus equipment">
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <div className="hero-plinth"><span /></div>
      <div className="hero-camera">
        <div className="camera-flash" /><div className="camera-top" />
        <div className="camera-lens"><i /><b /></div><div className="camera-grip" />
      </div>
      <div className="hero-mic"><span /><i /><b /></div>
      <div className="vault-token"><ShieldCheck size={23} /><span>CV</span></div>
      <div className="hero-diamond diamond-a" /><div className="hero-diamond diamond-b" />
      <div className="hero-dot dot-a" /><div className="hero-dot dot-b" />
      <div className="hero-caption"><span className="caption-dot" /> GOOD GEAR. SHARED HERE.</div>
    </div>
  )
}

function Header({ theme, setTheme, role, setRole, society, setSociety, notifications, markRead, savedCount }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const unread = notifications.filter((notice) => !notice.read && (notice.audience === 'all' || notice.audience === role)).length
  const location = useLocation()
  useEffect(() => { setProfileOpen(false); setNoticeOpen(false) }, [location.pathname])
  const toggleRole = () => setRole(role === 'student' ? 'manager' : 'student')
  return (
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-mark"><VaultIcon /></span><span>campus<span className="brand-light">vault</span><small>TIET · THE CAMPUS SHARING NETWORK</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <NavLink to="/" end>Explore Gear</NavLink>
        <NavLink to="/bookings">My Bookings</NavLink>
        <NavLink to="/saved">Saved Gear{savedCount > 0 && <span className="nav-count">{savedCount}</span>}</NavLink>
        <NavLink to="/compare">Compare</NavLink>
      </nav>
      <div className="topbar-actions">
        <label className="theme-select" aria-label="Color theme">
          {theme === 'dark' ? <Moon size={15} /> : theme === 'system' ? <Laptop size={15} /> : <Sun size={15} />}
          <select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label="Theme">
            <option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option>
          </select><ChevronDown size={13} />
        </label>
        <div className="popover-wrap">
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => { setNoticeOpen(!noticeOpen); setProfileOpen(false) }}>
            <Bell size={18} />{unread > 0 && <i className="notification-dot" />}
          </button>
          {noticeOpen && <div className="popover notification-popover">
            <div className="popover-head"><div><strong>Notifications</strong><small>{unread} unread</small></div><button className="text-button" onClick={markRead}>Mark all read</button></div>
            <div className="notice-list">{notifications.length ? notifications.slice(0, 8).map((notice) => <div key={notice.id} className={`notice-item ${notice.read ? '' : 'notice-unread'}`}><span className="notice-icon"><Bell size={15} /></span><span>{notice.message}<small>{new Date(notice.createdAt).toLocaleDateString()}</small></span></div>) : <div className="empty-mini">You're all caught up.</div>}</div>
          </div>}
        </div>
        <div className="popover-wrap">
          <button className="profile-button" onClick={() => { setProfileOpen(!profileOpen); setNoticeOpen(false) }}>
            <span className="avatar">{role === 'student' ? 'AS' : 'AM'}</span><span className="profile-copy">{role === 'student' ? currentStudent : 'Aarav Mehta'}<small>{role === 'student' ? 'Student member' : 'Society manager'}</small></span><ChevronDown size={14} />
          </button>
          {profileOpen && <div className="popover profile-popover">
            <div className="profile-popover-title">DEMO ACCESS</div>
            <button className="role-option" onClick={() => setRole('student')}><Users size={16} /><span>Student / Member</span>{role === 'student' && <Check size={15} />}</button>
            <button className="role-option" onClick={() => setRole('manager')}><LayoutDashboard size={16} /><span>Society Manager</span>{role === 'manager' && <Check size={15} />}</button>
            {role === 'manager' && <label className="society-switcher">MANAGE SOCIETY<select value={society} onChange={(event) => setSociety(event.target.value)}>{societies.map((name) => <option key={name}>{name}</option>)}</select></label>}
            <div className="profile-demo-note"><Sparkles size={14} /> Demo mode · no real sign-in</div>
            <button className="manager-link" onClick={toggleRole}><ArrowRight size={14} />{role === 'student' ? 'Switch to manager portal' : 'Switch to student view'}</button>
          </div>}
        </div>
        <Link to="/manager" className={`manager-shortcut ${role === 'manager' ? 'is-visible' : ''}`} title="Manager portal"><LayoutDashboard size={17} /></Link>
      </div>
    </header>
  )
}

function VaultIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="8" fill="currentColor" opacity=".16" /><path d="M10 8.5h12a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H10A2.5 2.5 0 0 1 7.5 21V11A2.5 2.5 0 0 1 10 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="16" cy="16" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M16 12v8m-2.5-4h5M7.5 13h-2m21 0h-2M7.5 19h-2m21 0h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
}

function ProductCard({ item, availability, saved, compared, toggleSaved, toggleCompare, openBooking }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap"><Link to={`/gear/${item.id}`}><ProductArt item={item} /></Link>
        <span className={`availability-pill ${availability ? 'available' : 'unavailable'}`}><i />{availability ? 'Available' : 'Fully booked'}</span>
        <button className={`save-button ${saved ? 'saved' : ''}`} aria-label={saved ? 'Remove from saved gear' : 'Save gear'} onClick={() => toggleSaved(item.id)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="product-card-content">
        <div className="product-meta"><span>{item.category}</span><span><Star size={13} fill="currentColor" /> {item.rating}</span></div>
        <Link to={`/gear/${item.id}`} className="product-title">{item.name}</Link>
        <div className="society-label"><span className="society-avatar">{item.society.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><span>Owned by <b>{item.society}</b></span></div>
        <div className="product-facts"><span>{availability} of {item.total} units available</span><span>·</span><span>{item.condition}</span></div>
        <div className="product-card-footer">
          <button className={`compare-toggle ${compared ? 'selected' : ''}`} onClick={() => toggleCompare(item.id)} aria-label={compared ? 'Remove from comparison' : 'Add to comparison'}><Check size={13} /> Compare</button>
          <button className="button button-dark button-small" disabled={availability < 1} onClick={() => openBooking(item)}>Request Slot <ArrowRight size={14} /></button>
        </div>
      </div>
    </article>
  )
}

function HomePage({ vault, saved, compared, toggleSaved, toggleCompare, openBooking, role }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Gear')
  const [sort, setSort] = useState('Recommended')
  const { resources, bookings } = vault
  const filtered = useMemo(() => {
    const result = resources.filter((item) => (category === 'All Gear' || item.category === category)
      && `${item.name} ${item.category} ${item.society}`.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'Name A–Z') result.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'Recently Added') result.sort((a, b) => a.addedAt - b.addedAt)
    if (sort === 'Highest Rated') result.sort((a, b) => b.rating - a.rating)
    if (sort === 'Most Available') result.sort((a, b) => getAvailability(b, bookings, today, today) - getAvailability(a, bookings, today, today))
    return result
  }, [resources, bookings, category, query, sort])
  const availableCameras = resources.filter((item) => item.category === 'Media & Film' && /camera/i.test(item.name))
    .reduce((sum, item) => sum + getAvailability(item, bookings, daysFromToday(5), daysFromToday(6)), 0)
  const availablePA = resources.filter((item) => /speaker/i.test(item.name))
    .reduce((sum, item) => sum + getAvailability(item, bookings, daysFromToday(5), daysFromToday(6)), 0)
  const recentlyViewed = JSON.parse(localStorage.getItem('campusvault-recent') || '[]')
    .map((id) => resources.find((item) => item.id === id)).filter(Boolean).slice(0, 4)
  return (
    <>
      <main>
        <section className="hero container">
          <div className="hero-visual"><div className="hero-sticker"><span className="hero-sticker-mark"><VaultIcon /></span><span><b>CampusVault</b><small>THE SHARING NETWORK</small></span></div><VaultIllustration /><div className="hero-visual-foot"><span>TIET · PATIALA</span><span>EST. FOR MAKERS <ArrowUpRight size={14} /></span></div></div>
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE CAMPUS SHARING NETWORK</div>
            <h1>Unlock the Vault.<br /><span>Build Your Vision.</span></h1>
            <p className="hero-description">Borrow 4K cameras, sound systems, robotics kits, and event props owned by campus societies — all in one place.</p>
            <div className="feature-pills"><span><Zap size={14} /> Instant Booking</span><span><ShieldCheck size={14} /> Society Verified</span><span><span className="rupee-mark">₹</span> Zero Rental Fees</span></div>
            <div className="hero-ctas"><a className="button button-dark" href="#catalogue">Open the Vault <ArrowRight size={16} /></a><button className="button button-quiet" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works <CircleHelp size={15} /></button></div>
            <div className="trust-row"><div className="avatar-stack"><i>AS</i><i>RK</i><i>MI</i><i>+2k</i></div><span>Built for the doers<br /><b>at TIET</b></span><div className="trust-divider" /><span className="trust-rating"><Star size={14} fill="currentColor" /> 4.9 <small>community rating</small></span></div>
          </div>
          <div className="hero-ticker"><span className="ticker-icon"><Activity size={15} /></span><span><b>Available this weekend</b><small>{availableCameras} cameras and {availablePA} PA systems across campus</small></span><span className="live-tag"><i /> LIVE DEMO</span></div>
        </section>
        <section className="catalogue container" id="catalogue">
          <div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" /> THE SHARED INVENTORY</div><h2>Find the gear.<br className="mobile-break" /> Make it happen.</h2><p>Everything your campus societies share, ready when you need it.</p></div><div className="catalogue-count"><span>{resources.length.toString().padStart(2, '0')}</span><small>resources<br />in the vault</small></div></div>
          <div className="catalogue-toolbar">
            <label className="search-field"><Search size={18} /><input placeholder="Search cameras, microphones, robotics kits..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label>
            <label className="sort-select"><SlidersHorizontal size={15} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>Recently Added</option><option>Name A–Z</option><option>Most Available</option><option>Highest Rated</option></select><ChevronDown size={14} /></label>
          </div>
          <div className="category-scroller" role="tablist">{categoryTabs.map((name) => <button key={name} role="tab" aria-selected={category === name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
          {filtered.length ? <div className="product-grid">{filtered.map((item) => <ProductCard key={item.id} item={item} availability={getAvailability(item, bookings, today, today)} saved={saved.includes(item.id)} compared={compared.includes(item.id)} toggleSaved={toggleSaved} toggleCompare={toggleCompare} openBooking={openBooking} />)}</div>
            : <div className="empty-state"><div className="empty-icon"><Search /></div><h3>No gear found</h3><p>Try a different search or category.</p><button className="button button-light" onClick={() => { setQuery(''); setCategory('All Gear') }}>Clear filters</button></div>}
          {recentlyViewed.length > 0 && <section className="recent-section"><div className="section-kicker">BACK IN THE VAULT</div><div className="recent-heading"><h3>Recently viewed</h3><span>Pick up where you left off</span></div><div className="recent-row">{recentlyViewed.map((item) => <Link className="recent-item" to={`/gear/${item.id}`} key={item.id}><ProductArt item={item} /><span><b>{item.name}</b><small>{item.category}</small></span><ArrowUpRight size={15} /></Link>)}</div></section>}
          <section className="how-section" id="how-it-works"><div className="how-intro"><div className="eyebrow"><span className="eyebrow-line" /> LESS WAITING. MORE MAKING.</div><h2>Good things happen<br />when gear gets shared.</h2><p>One easy flow from discovery to pickup. All demo bookings are stored locally on this device.</p></div><div className="how-steps"><div><span>01</span><Search /><b>Find your gear</b><p>Explore verified equipment from societies across campus.</p></div><div><span>02</span><CalendarDays /><b>Choose your dates</b><p>Check availability and request the time slot that works.</p></div><div><span>03</span><TicketCheck /><b>Make it happen</b><p>Get manager approval, pick up your gear, and create.</p></div></div></section>
          <div className="demo-footnote"><ShieldCheck size={14} /> Demo availability, bookings, and ratings are illustrative and saved in this browser.</div>
        </section>
      </main>
    </>
  )
}

function DetailPage({ vault, saved, compared, toggleSaved, toggleCompare, openBooking }) {
  const { id } = useParams()
  const item = vault.resources.find((resource) => resource.id === id)
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('campusvault-recent') || '[]')
    localStorage.setItem('campusvault-recent', JSON.stringify([id, ...recent.filter((recentId) => recentId !== id)].slice(0, 6)))
  }, [id])
  if (!item) return <NotFound />
  const available = getAvailability(item, vault.bookings, today, today)
  const similar = vault.resources.filter((resource) => resource.id !== item.id && resource.category === item.category).slice(0, 3)
  const borrowed = vault.bookings.filter((booking) => booking.resourceId === item.id && ['checked_out', 'overdue'].includes(booking.status)).reduce((sum, booking) => sum + booking.quantity, 0)
  return <main className="page-main container">
    <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to Explore</Link>
    <div className="detail-layout"><div className="detail-art"><ProductArt item={item} large /><span className="detail-art-stamp"><ShieldCheck size={14} /> SOCIETY VERIFIED</span></div><div className="detail-copy">
      <div className="product-meta"><span>{item.category}</span><span><Star size={14} fill="currentColor" /> {item.rating} community rating</span></div><h1>{item.name}</h1>
      <div className="society-label detail-society"><span className="society-avatar">{item.society.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><span>Shared by <b>{item.society}</b></span><ShieldCheck size={16} /></div>
      <p className="detail-description">{item.description}</p>
      <div className="detail-stock"><span className={`availability-pill ${available ? 'available' : 'unavailable'}`}><i />{available ? `${available} available now` : 'Currently booked'}</span><span>Condition <b>{item.condition}</b></span></div>
      <div className="detail-actions"><button className="button button-dark" disabled={!available} onClick={() => openBooking(item)}>Check availability <CalendarDays size={16} /></button><button className={`button button-light ${saved.includes(item.id) ? 'is-saved' : ''}`} onClick={() => toggleSaved(item.id)}><Bookmark size={16} fill={saved.includes(item.id) ? 'currentColor' : 'none'} />{saved.includes(item.id) ? 'Saved' : 'Save for later'}</button><button className={`button button-light ${compared.includes(item.id) ? 'is-saved' : ''}`} onClick={() => toggleCompare(item.id)}><ArrowDownUp size={16} />{compared.includes(item.id) ? 'In compare' : 'Compare'}</button></div>
      <div className="spec-summary"><div><span>Total quantity</span><b>{item.total} units</b></div><div><span>Available now</span><b>{available} units</b></div><div><span>Currently borrowed</span><b>{borrowed} units</b></div><div><span>Max duration</span><b>{item.maxDays} days</b></div></div>
      <div className="detail-info-grid"><div><MapPin size={16} /><span><small>STORAGE LOCATION</small><b>{item.location}</b></span></div><div><Users size={16} /><span><small>SOCIETY CONTACT</small><b>{item.manager.name} · Demo manager</b></span></div></div>
    </div></div>
    <section className="detail-lower"><div className="detail-panel"><div className="panel-title"><h3>Specifications</h3><span>Demo information</span></div><div className="spec-list">{Object.entries(item.specs).map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></div><div className="detail-panel"><div className="panel-title"><h3>Borrowing guidelines</h3><span>{item.maxDays} day maximum</span></div>{item.rules.map((rule) => <div className="rule-row" key={rule}><CheckCircle2 size={16} /><span>{rule}</span></div>)}</div></section>
    {similar.length > 0 && <section className="similar-section"><div className="recent-heading"><div><div className="section-kicker">MORE TO EXPLORE</div><h3>Similar equipment</h3></div><Link to="/" className="text-button">Browse all <ArrowRight size={14} /></Link></div><div className="product-grid">{similar.map((resource) => <ProductCard key={resource.id} item={resource} availability={getAvailability(resource, vault.bookings, today, today)} saved={saved.includes(resource.id)} compared={compared.includes(resource.id)} toggleSaved={toggleSaved} toggleCompare={toggleCompare} openBooking={openBooking} />)}</div></section>}
  </main>
}

function ComparePage({ vault, compared, toggleCompare, toggleSaved, saved, openBooking }) {
  const items = compared.map((id) => vault.resources.find((resource) => resource.id === id)).filter(Boolean)
  const rows = [
    ['Society', (item) => item.society], ['Category', (item) => item.category], ['Condition', (item) => item.condition],
    ['Available now', (item) => `${getAvailability(item, vault.bookings, today, today)} / ${item.total} units`],
    ['Borrowing duration', (item) => `Up to ${item.maxDays} days`], ['Rating', (item) => `★ ${item.rating}`],
    ['Storage location', (item) => item.location], ...Object.keys(items[0]?.specs || {}).map((key) => [key, (item) => item.specs[key] || '—']),
  ]
  return <main className="page-main container">
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> SIDE BY SIDE</div><h1>Compare gear<span className="heading-period">.</span></h1><p>Make the right call before you book. Specifications are illustrative demo information.</p></div><Link to="/" className="button button-light"><Plus size={16} /> Add gear</Link></div>
    {items.length < 2 ? <div className="compare-empty"><div className="empty-icon"><ArrowDownUp /></div><h3>Better decisions, together.</h3><p>Select two or three items from the catalogue to compare them side by side.</p><Link className="button button-dark" to="/">Explore the vault <ArrowRight size={15} /></Link>{items.length === 1 && <div className="compare-single"><ProductArt item={items[0]} /><span><b>{items[0].name}</b><button className="icon-button" onClick={() => toggleCompare(items[0].id)}><X size={15} /></button></span></div>}</div>
      : <><div className="compare-table-wrap"><div className="compare-table"><div className="compare-label-column"><div className="compare-spacer" />{rows.map(([label]) => <div className="compare-label" key={label}>{label}</div>)}</div>{items.map((item) => <div className="compare-column" key={item.id}><div className="compare-product"><button className="remove-compare" onClick={() => toggleCompare(item.id)} aria-label="Remove item"><X size={15} /></button><ProductArt item={item} /><Link to={`/gear/${item.id}`}><h3>{item.name}</h3></Link><span className="compare-category">{item.category}</span><button className="button button-dark button-small" disabled={!getAvailability(item, vault.bookings, today, today)} onClick={() => openBooking(item)}>Request slot <ArrowRight size={13} /></button></div>{rows.map(([label, valueFor]) => <div className="compare-value" key={label}>{valueFor(item) || '—'}</div>)}</div>)}</div></div><div className="compare-bottom"><span><Sparkles size={15} /> Differences are highlighted using demo specifications.</span><button className="text-button" onClick={() => compared.forEach((id) => toggleCompare(id))}>Clear comparison</button></div></>}
  </main>
}

function BookingModal({ item, vault, close, createBooking }) {
  const [startDate, setStartDate] = useState(daysFromToday(1))
  const [endDate, setEndDate] = useState(daysFromToday(2))
  const [startTime, setStartTime] = useState(times[0])
  const [endTime, setEndTime] = useState(times[2])
  const [quantity, setQuantity] = useState(1)
  const [purpose, setPurpose] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(`${daysFromToday(1)}T12:00:00`))
  const [calendarTarget, setCalendarTarget] = useState('collection')
  const capacity = getAvailability(item, vault.bookings, startDate, endDate)
  const maxDuration = startDate && endDate ? Math.ceil((new Date(`${endDate}T12:00:00`) - new Date(`${startDate}T12:00:00`)) / 86400000) + 1 : 0
  const invalidDate = !startDate || !endDate || endDate < startDate
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const calendarOffset = (firstDay.getDay() + 6) % 7
  const calendarDays = Array.from({ length: Math.ceil((calendarOffset + new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()) / 7) * 7 }, (_, index) => {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - calendarOffset + 1, 12)
    return date.getMonth() === calendarMonth.getMonth() ? localDate(date) : ''
  })
  const chooseCalendarDate = (date) => {
    if (calendarTarget === 'collection') {
      setStartDate(date)
      if (endDate < date) setEndDate(date)
      setCalendarTarget('return')
    } else {
      if (date < startDate) {
        setStartDate(date)
        setEndDate(date)
        setCalendarTarget('return')
      } else {
        setEndDate(date)
      }
    }
    setError('')
  }
  const submit = () => {
    if (invalidDate) return setError('Choose a valid collection and return date.')
    if (maxDuration > item.maxDays) return setError(`This resource can be borrowed for up to ${item.maxDays} days.`)
    if (!capacity || quantity > capacity) return setError(`Only ${capacity} unit${capacity === 1 ? '' : 's'} available for the full selected period.`)
    if (!purpose.trim()) return setError('Please tell the society what you are borrowing this for.')
    setError('')
    if (step === 1) setStep(2)
    else createBooking({ resourceId: item.id, quantity, startDate, startTime, endDate, endTime, purpose: purpose.trim(), notes: notes.trim() })
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
    <div className="modal-top"><div><div className="eyebrow"><span className="eyebrow-line" /> {step === 1 ? 'RESERVATION REQUEST' : 'REVIEW YOUR REQUEST'}</div><h2 id="booking-title">{step === 1 ? 'Make it yours.' : 'One last look.'}</h2></div><button className="icon-button" onClick={close} aria-label="Close"><X /></button></div>
    <div className="booking-resource"><ProductArt item={item} /><div><b>{item.name}</b><small>{item.society} · {item.category}</small></div><span className="rating"><Star size={13} fill="currentColor" />{item.rating}</span></div>
    {step === 1 ? <div className="booking-form">
      <div className="date-range-fields"><label>Collection date<input type="date" min={today} value={startDate} onChange={(event) => { setStartDate(event.target.value); if (endDate < event.target.value) setEndDate(event.target.value); setError('') }} /></label><label>Expected return date<input type="date" min={startDate || today} value={endDate} onChange={(event) => { setEndDate(event.target.value); setError('') }} /></label></div>
      <div className="availability-calendar">
        <div className="calendar-head"><div><b>{calendarMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</b><small>Choose your collection and return dates</small></div><div className="calendar-nav"><button className="icon-button" aria-label="Previous month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1, 12))}><ChevronLeft size={16} /></button><button className="icon-button" aria-label="Next month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1, 12))}><ChevronRight size={16} /></button></div></div>
        <div className="calendar-target"><span>Selecting</span><button className={calendarTarget === 'collection' ? 'active' : ''} onClick={() => setCalendarTarget('collection')}>Collection</button><button className={calendarTarget === 'return' ? 'active' : ''} onClick={() => setCalendarTarget('return')}>Return</button></div>
        <div className="calendar-grid calendar-weekdays">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
        <div className="calendar-grid">{calendarDays.map((date, index) => {
          if (!date) return <span className="calendar-blank" key={`empty-${index}`} />
          const availableOnDate = getAvailability(item, vault.bookings, date, date)
          const booked = availableOnDate === 0 || date < today
          const busy = availableOnDate < item.total - (item.maintenance || 0)
          const selectedDate = date === startDate || date === endDate
          const inRange = date > startDate && date < endDate
          const maintenanceOnly = item.maintenance > 0 && availableOnDate <= item.total - item.maintenance
          return <button key={date} disabled={booked} className={`calendar-day ${selectedDate ? 'selected' : ''} ${inRange ? 'in-range' : ''} ${booked ? 'booked' : busy ? 'partial' : 'open'} ${maintenanceOnly ? 'maintenance' : ''}`} onClick={() => chooseCalendarDate(date)} title={`${availableOnDate} available${maintenanceOnly ? ' · maintenance units unavailable' : ''}`}><span>{Number(date.slice(-2))}</span><small>{booked ? 'Full' : `${availableOnDate} left`}</small></button>
        })}</div>
      </div>
      <div className="calendar-legend"><span><i className="legend-available" />Available</span><span><i className="legend-partial" />Limited</span><span><i className="legend-none" />Booked</span><span className="capacity-note"><b>{invalidDate ? 0 : capacity}</b> available for these dates</span></div>
      <div className="time-fields"><label>Collection slot<select value={startTime} onChange={(event) => setStartTime(event.target.value)}>{times.map((time) => <option key={time}>{time}</option>)}</select></label><label>Return slot<select value={endTime} onChange={(event) => setEndTime(event.target.value)}>{times.map((time) => <option key={time}>{time}</option>)}</select></label></div>
      <div className="form-row"><label>Quantity requested<input type="number" min="1" max={Math.max(1, capacity)} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} /></label><span className="field-hint">Up to {item.maxDays} days · {item.condition}</span></div>
      <label>What will you use it for?<input value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="e.g. Student film project, workshop..." maxLength={120} /></label>
      <label>Notes for the society <span className="optional">OPTIONAL</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Anything the society should know?" rows="2" maxLength={300} /></label>
      <p className="borrow-rule"><ShieldCheck size={15} /> Bring your student ID. Society approval is required before collection.</p>
    </div> : <div className="booking-summary"><div className="summary-row"><span>Resource</span><b>{item.name}</b></div><div className="summary-row"><span>Society</span><b>{item.society}</b></div><div className="summary-row"><span>Quantity</span><b>{quantity} unit{quantity > 1 ? 's' : ''}</b></div><div className="summary-row"><span>Collection</span><b>{displayDate(startDate)} · {startTime}</b></div><div className="summary-row"><span>Expected return</span><b>{displayDate(endDate)} · {endTime}</b></div><div className="summary-row"><span>Purpose</span><b>{purpose}</b></div><div className="approval-note"><Clock3 size={16} /><span>Your request will be sent to <b>{item.society}</b>. You’ll get an update as soon as they review it.</span></div></div>}
    {error && <div className="form-error"><CircleAlert size={15} />{error}</div>}
    <div className="modal-actions">{step === 2 && <button className="button button-light" onClick={() => setStep(1)}><ArrowLeft size={15} /> Edit details</button>}<button className="button button-dark" onClick={submit}>{step === 1 ? 'Review request' : 'Confirm request'} <ArrowRight size={15} /></button></div>
  </section></div>
}

function BookingsPage({ vault, cancelBooking, requestReturn, showPass }) {
  const [tab, setTab] = useState('All')
  const [selected, setSelected] = useState(null)
  const tabs = ['All', 'Pending', 'Approved', 'Ready for Pickup', 'Checked Out', 'Returned', 'Rejected', 'Cancelled']
  const current = vault.bookings.filter((booking) => booking.student === currentStudent)
    .map((booking) => ({ ...booking, status: booking.status === 'checked_out' && booking.endDate < today ? 'overdue' : booking.status }))
  const filtered = current.filter((booking) => tab === 'All' || (tab === 'Ready for Pickup' ? booking.status === 'approved' : booking.status === 'checked_out' || booking.status === 'overdue' ? tab === 'Checked Out' : booking.status === tab.toLowerCase()))
  const totalActive = current.filter((booking) => ['checked_out', 'overdue'].includes(booking.status)).length
  return <main className="page-main container">
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR CAMPUSVAULT</div><h1>My bookings<span className="heading-period">.</span></h1><p>Every request and return, all in one place.</p></div><div className="member-stats"><div><span>{totalActive.toString().padStart(2, '0')}</span><small>active loans</small></div><div><span>{current.filter((booking) => booking.status === 'pending').length.toString().padStart(2, '0')}</span><small>pending requests</small></div><div><span>{vault.saved.length.toString().padStart(2, '0')}</span><small>saved gear</small></div></div></div>
    <div className="tabs-scroll booking-tabs">{tabs.map((name) => <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}<span>{name === 'All' ? current.length : filtered.filter((booking) => booking.status === name.toLowerCase()).length}</span></button>)}</div>
    {filtered.length ? <div className="booking-list">{filtered.map((booking) => {
      const item = vault.resources.find((resource) => resource.id === booking.resourceId)
      return <article className="booking-card" key={booking.id}><div className="booking-card-main"><ProductArt item={item} /><div className="booking-card-info"><div className="booking-title-line"><h3>{item?.name || 'Removed resource'}</h3><span className={statusClass(booking.status)}><i />{statusNames[booking.status]}</span></div><p>{booking.society} <span>·</span> {booking.quantity} unit{booking.quantity > 1 ? 's' : ''}</p><div className="booking-dates"><span><CalendarDays size={14} />{displayDate(booking.startDate)} <small>to</small> {displayDate(booking.endDate)}</span><span><ClipboardList size={14} />Ref. {booking.id}</span></div>{booking.rejectionReason && <div className="reject-reason">{booking.rejectionReason}</div>}</div></div>
        <div className="booking-card-actions"><button className="text-button" onClick={() => setSelected(booking)}>View details <ArrowRight size={14} /></button>{['approved', 'checked_out', 'overdue'].includes(booking.status) && <button className="button button-light button-small" onClick={() => showPass(booking)}>Digital pass <QrCode size={14} /></button>}{booking.status === 'pending' && <button className="text-button danger-text" onClick={() => cancelBooking(booking.id)}>Cancel request</button>}{['checked_out', 'overdue'].includes(booking.status) && <button className="button button-light button-small" onClick={() => requestReturn(booking.id)}>{booking.returnRequested ? 'Return requested' : 'Request return'} <RotateCcw size={14} /></button>}</div>
      </article>
    })}</div> : <div className="empty-state bookings-empty"><div className="empty-icon"><ClipboardList /></div><h3>{current.length ? `No ${tab.toLowerCase()} bookings` : 'Your next big idea starts here.'}</h3><p>{current.length ? 'Try another filter to find your booking.' : 'Browse shared gear and request a slot when you’re ready.'}</p><Link to="/" className="button button-dark">Explore gear <ArrowRight size={15} /></Link></div>}
    {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}><div className="simple-modal"><div className="modal-top"><div><div className="eyebrow"><span className="eyebrow-line" /> BOOKING DETAILS</div><h2>{selected.id}</h2></div><button className="icon-button" onClick={() => setSelected(null)}><X /></button></div><div className="booking-summary"><div className="summary-row"><span>Resource</span><b>{vault.resources.find((item) => item.id === selected.resourceId)?.name}</b></div><div className="summary-row"><span>Status</span><span className={statusClass(selected.status)}>{statusNames[selected.status]}</span></div><div className="summary-row"><span>Collection</span><b>{displayDate(selected.startDate)} · {selected.startTime}</b></div><div className="summary-row"><span>Return</span><b>{displayDate(selected.endDate)} · {selected.endTime}</b></div><div className="summary-row"><span>Purpose</span><b>{selected.purpose}</b></div></div><div className="modal-actions"><button className="button button-dark" onClick={() => setSelected(null)}>Done <Check size={15} /></button></div></div></div>}
  </main>
}

function SavedPage({ vault, saved, toggleSaved, toggleCompare, compared, openBooking }) {
  const items = saved.map((id) => vault.resources.find((resource) => resource.id === id)).filter(Boolean)
  return <main className="page-main container"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR SHORTLIST</div><h1>Saved gear<span className="heading-period">.</span></h1><p>Good gear is worth keeping an eye on.</p></div><span className="saved-count">{items.length.toString().padStart(2, '0')} SAVED ITEMS</span></div>{items.length ? <div className="product-grid">{items.map((item) => <ProductCard key={item.id} item={item} availability={getAvailability(item, vault.bookings, today, today)} saved={true} compared={compared.includes(item.id)} toggleSaved={toggleSaved} toggleCompare={toggleCompare} openBooking={openBooking} />)}</div> : <div className="empty-state"><div className="empty-icon"><Bookmark /></div><h3>A little inspiration goes a long way.</h3><p>Tap the bookmark on anything you’d like to come back to.</p><Link className="button button-dark" to="/">Discover the vault <ArrowRight size={15} /></Link></div>}</main>
}

function PassModal({ booking, item, close }) {
  const [copied, setCopied] = useState(false)
  if (!booking || !item) return null
  const status = booking.status === 'checked_out' || booking.status === 'overdue' ? booking.status : 'approved'
  const copy = async () => {
    try { await navigator.clipboard.writeText(booking.id); setCopied(true); setTimeout(() => setCopied(false), 1800) }
    catch (error) { console.error('Could not copy the booking reference.', error) }
  }
  return <div className="modal-backdrop pass-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="pass-modal" role="dialog" aria-modal="true">
    <div className="pass-modal-head"><span>DIGITAL BORROWING PASS</span><button className="icon-button" onClick={close}><X /></button></div>
    <div className="digital-pass"><div className="pass-topline"><span className="pass-brand"><span className="brand-mark"><VaultIcon /></span>campusvault</span><span className={`status status-${status}`}><i />{status === 'approved' ? 'Ready for collection' : statusNames[status]}</span></div>
      <div className="pass-equipment"><ProductArt item={item} /><div><small>YOUR EQUIPMENT</small><h2>{item.name}</h2><span>{booking.society}</span></div></div>
      <div className="pass-dash"><i /><span /><i /></div>
      <div className="pass-details"><div><small>PASS HOLDER</small><b>{booking.student}</b></div><div><small>QUANTITY</small><b>{booking.quantity} unit{booking.quantity > 1 ? 's' : ''}</b></div><div><small>COLLECT ON</small><b>{displayDate(booking.startDate)} · {booking.startTime}</b></div><div><small>RETURN BY</small><b>{displayDate(booking.endDate)} · {booking.endTime}</b></div></div>
      <div className="pass-code-row"><div><small>BOOKING REFERENCE</small><div className="pass-code">{booking.id}<button className="icon-button" onClick={copy} aria-label="Copy booking reference">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div></div><div className="demo-qr" aria-label="Decorative demo QR pattern">{Array.from({ length: 49 }, (_, index) => <i key={index} style={{ opacity: (index * 7 + index % 5) % 4 === 0 ? 0.18 : 1 }} />)}<span>CV</span></div></div>
      <div className="pass-warning"><CircleAlert size={14} />Demo pass only · QR-style graphic is not scannable.</div>
    </div>
    <div className="pass-instructions"><b><MapPin size={15} /> Pickup instructions</b><span>Show this pass and your student ID to the society manager at the collection point.</span></div>
    <div className="pass-actions"><button className="button button-light" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy reference'}</button><button className="button button-dark" onClick={() => window.print()}><Printer size={15} /> Print pass</button></div>
  </section></div>
}

function ManagerLayout({ vault, society, setSociety, approve, reject, checkout, confirmReturn, editResource, deleteResource, role }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useEffect(() => { if (role !== 'manager') navigate('/manager', { replace: true }) }, [role, navigate])
  const section = location.pathname.split('/')[2] || 'overview'
  const societyResources = vault.resources.filter((item) => item.society === society)
  const societyBookings = vault.bookings.filter((booking) => booking.society === society)
  const pending = societyBookings.filter((booking) => booking.status === 'pending')
  const outstanding = societyBookings.filter((booking) => ['checked_out', 'overdue'].includes(booking.status === 'checked_out' && booking.endDate < today ? 'overdue' : booking.status))
  const nav = [['overview', 'Overview', LayoutDashboard], ['inventory', 'Inventory', Package], ['requests', 'Booking Requests', ClipboardList], ['issued', 'Issued Equipment', TicketCheck], ['returns', 'Returns', RotateCcw], ['analytics', 'Analytics', ChartNoAxesCombined], ['settings', 'Society Settings', Settings2]]
  const pageTitle = nav.find(([path]) => path === section)?.[1] || 'Overview'
  return <main className="manager-shell">
    <aside className="manager-sidebar"><div className="manager-sidebar-label">SOCIETY PORTAL</div><div className="manager-society-name"><span className="society-avatar">{society.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><span><b>{society}</b><small>TIET Society</small></span><ChevronDown size={14} /></div><div className="sidebar-nav">{nav.map(([path, label, Icon]) => <NavLink key={path} to={`/manager/${path}`} className={({ isActive }) => `sidebar-link ${isActive || (path === 'overview' && section === 'overview') ? 'active' : ''}`}><Icon size={17} />{label}{path === 'requests' && pending.length > 0 && <span className="sidebar-count">{pending.length}</span>}</NavLink>)}</div><div className="sidebar-bottom"><div className="sidebar-help"><CircleHelp size={16} /><span><b>Need a hand?</b><small>Visit the demo help centre</small></span><ArrowUpRight size={14} /></div><div className="demo-mode-tag"><span /> DEMO MODE · LOCAL DATA</div></div></aside>
    <section className="manager-content"><div className="manager-topline"><div className="manager-mobile-title"><button className="icon-button" aria-label="Toggle manager navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><Menu /></button><span>Manager portal</span></div><div><div className="eyebrow"><span className="eyebrow-line" /> SOCIETY MANAGEMENT</div><h1>{pageTitle}<span className="heading-period">.</span></h1></div><div className="manager-top-actions"><label className="society-select"><Users size={15} /><select value={society} onChange={(event) => setSociety(event.target.value)}>{societies.map((name) => <option key={name}>{name}</option>)}</select><ChevronDown size={13} /></label><span className="manager-demo-label"><i /> DEMO PORTAL</span></div></div>
      {mobileMenuOpen && <nav className="manager-mobile-nav">{nav.map(([path, label, Icon]) => <NavLink key={path} to={`/manager/${path}`} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `sidebar-link ${isActive || (path === 'overview' && section === 'overview') ? 'active' : ''}`}><Icon size={16} />{label}{path === 'requests' && pending.length > 0 && <span className="sidebar-count">{pending.length}</span>}</NavLink>)}</nav>}
      {section === 'overview' && <ManagerOverview resources={societyResources} bookings={societyBookings} vault={vault} society={society} approve={approve} reject={reject} />}
      {section === 'inventory' && <InventoryPage resources={societyResources} bookings={societyBookings} editResource={editResource} deleteResource={deleteResource} society={society} />}
      {section === 'requests' && <RequestsPage bookings={societyBookings} resources={vault.resources} approve={approve} reject={reject} society={society} />}
      {section === 'issued' && <IssuedPage bookings={societyBookings} resources={vault.resources} checkout={checkout} society={society} />}
      {section === 'returns' && <ReturnsPage bookings={societyBookings} resources={vault.resources} confirmReturn={confirmReturn} society={society} />}
      {section === 'analytics' && <AnalyticsPage bookings={societyBookings} resources={societyResources} />}
      {section === 'settings' && <SettingsPage society={society} resources={societyResources} />}
    </section>
  </main>
}

function ManagerOverview({ resources, bookings, vault, society, approve, reject }) {
  const pending = bookings.filter((booking) => booking.status === 'pending')
  const out = bookings.filter((booking) => ['checked_out', 'overdue'].includes(booking.status))
  const available = resources.reduce((sum, item) => sum + getAvailability(item, vault.bookings, today, today), 0)
  const total = resources.reduce((sum, item) => sum + item.total, 0)
  const maintenance = resources.reduce((sum, item) => sum + (item.maintenance || 0), 0)
  const recent = vault.activity.filter((entry) => entry.society === society).slice(0, 4)
  const chartData = [{ name: 'Available', value: available, fill: '#10a56c' }, { name: 'Reserved', value: bookings.filter((b) => ['pending', 'approved'].includes(b.status)).reduce((sum, b) => sum + b.quantity, 0), fill: '#f5b544' }, { name: 'Checked out', value: out.reduce((sum, b) => sum + b.quantity, 0), fill: '#5e8ce5' }, { name: 'Maintenance', value: maintenance, fill: '#eb8d92' }]
  return <div className="manager-page-content"><div className="manager-greeting"><div><h2>Good afternoon, Aarav <span>✦</span></h2><p>Here’s the latest from your society’s vault.</p></div><span className="date-chip"><CalendarDays size={14} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span></div>
    <div className="stats-grid">{[['Total resources', resources.length, Package, 'in your inventory'], ['Total units', total, Boxes, 'across all resources'], ['Available units', available, CheckCircle2, 'ready to request'], ['Pending requests', pending.length, Clock3, 'awaiting your review']].map(([label, value, Icon, caption], index) => <div className={`stat-card stat-card-${index}`} key={label}><span className="stat-icon"><Icon size={18} /></span><span className="stat-label">{label}</span><b>{String(value).padStart(2, '0')}</b><small>{caption}</small></div>)}</div>
    <div className="manager-overview-grid"><section className="manager-panel approvals-panel"><div className="panel-title"><div><h3>Pending approvals</h3><p>Give new requests a quick review.</p></div><Link to="/manager/requests" className="text-button">View all <ArrowRight size={14} /></Link></div>{pending.length ? pending.slice(0, 4).map((booking) => { const item = resources.find((resource) => resource.id === booking.resourceId); return <div className="approval-row" key={booking.id}><div className="avatar">{booking.student.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="approval-copy"><b>{booking.student}</b><span>{item?.name} · {booking.quantity} unit{booking.quantity > 1 ? 's' : ''}</span><small>{displayDate(booking.startDate)} — {displayDate(booking.endDate)}</small></div><div className="approval-actions"><button title="Reject" className="icon-button reject-button" onClick={() => reject(booking.id, '')}><X size={15} /></button><button title="Approve" className="icon-button approve-button" onClick={() => approve(booking.id)}><Check size={15} /></button></div></div> }) : <div className="empty-mini">All clear — no requests to review.</div>}</section>
    <section className="manager-panel chart-panel"><div className="panel-title"><div><h3>Inventory health</h3><p>Units across your society’s resources.</p></div><span className="chart-period">TODAY <ChevronDown size={12} /></span></div><div className="chart-body"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} /><Tooltip cursor={{ fill: 'var(--hover)' }} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--text)' }} /><Bar dataKey="value" radius={[5, 5, 0, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div></section></div>
    <div className="manager-overview-grid manager-overview-lower"><section className="manager-panel"><div className="panel-title"><div><h3>Upcoming returns</h3><p>Expected equipment returns in the next 7 days.</p></div><Link to="/manager/returns" className="text-button">Manage returns <ArrowRight size={14} /></Link></div>{out.filter((booking) => booking.endDate >= today).slice(0, 3).map((booking) => <div className="upcoming-row" key={booking.id}><div className="upcoming-date"><b>{new Date(`${booking.endDate}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit' })}</b><small>{new Date(`${booking.endDate}T12:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</small></div><div><b>{resources.find((item) => item.id === booking.resourceId)?.name}</b><small>{booking.student} · {booking.quantity} unit</small></div><span className="return-due">{booking.endDate === today ? 'Due today' : 'Upcoming'}</span></div>)}{out.filter((booking) => booking.endDate >= today).length === 0 && <div className="empty-mini">No equipment due back soon.</div>}</section><section className="manager-panel"><div className="panel-title"><div><h3>Recent activity</h3><p>A running log of your society’s activity.</p></div><Activity size={17} /></div>{recent.length ? recent.map((entry) => <div className="activity-row" key={entry.id}><span className="activity-dot" /><span>{entry.message}<small>{new Date(entry.createdAt).toLocaleString()}</small></span></div>) : <div className="empty-mini">New activity will appear here.</div>}</section></div>
    <div className="manager-footnote"><ShieldCheck size={14} /> All figures are calculated from the shared demo inventory and booking data.</div>
  </div>
}

function InventoryPage({ resources, bookings, editResource, deleteResource, society }) {
  const [modal, setModal] = useState(null)
  const [query, setQuery] = useState('')
  const filtered = resources.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
  const save = (resource) => { editResource(resource); setModal(null) }
  return <div className="manager-page-content"><div className="manager-toolbar"><div><h2>Your resources <span className="soft-count">{resources.length}</span></h2><p>Manage what your society shares with campus.</p></div><button className="button button-dark" onClick={() => setModal({ society, total: 1, maxDays: 7, condition: 'Excellent', maintenance: 0, rules: ['Bring your student ID when collecting.'] })}><Plus size={15} /> Add resource</button></div>
    <div className="inventory-filters"><label className="search-field"><Search size={16} /><input placeholder="Search your inventory..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><span><Filter size={14} /> {filtered.length} resources</span></div>
    <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Resource</th><th>Availability</th><th>Condition</th><th>Location</th><th>Max duration</th><th /></tr></thead><tbody>{filtered.map((item) => { const available = getAvailability(item, bookings, today, today); const active = bookings.some((booking) => booking.resourceId === item.id && isActiveBooking(booking)); return <tr key={item.id}><td><div className="table-resource"><ProductArt item={item} /><span><b>{item.name}</b><small>{item.category}</small></span></div></td><td><span className="stock-label">{available} / {item.total} <small>available</small></span><div className="stock-bar"><i style={{ width: `${Math.min(100, available / Math.max(1, item.total) * 100)}%` }} /></div></td><td>{item.condition}{item.maintenance > 0 && <small className="maintenance-label"><Wrench size={12} /> {item.maintenance} in maintenance</small>}</td><td>{item.location}</td><td>{item.maxDays} days</td><td><div className="table-actions"><button className="icon-button" title="Edit resource" onClick={() => setModal({ ...item })}><Pencil size={15} /></button><button className="icon-button danger-icon" title={active ? 'Cannot delete while active bookings exist' : 'Delete resource'} disabled={active} onClick={() => deleteResource(item.id)}><Trash2 size={15} /></button></div></td></tr> })}</tbody></table>{filtered.length === 0 && <div className="empty-mini">No resources match your search.</div>}</div>
    {modal && <ResourceModal resource={modal} close={() => setModal(null)} save={save} />}
  </div>
}

function ResourceModal({ resource, close, save }) {
  const [form, setForm] = useState(resource)
  const [error, setError] = useState('')
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = () => {
    if (!form.name?.trim()) return setError('Resource name is required.')
    if (!form.total || Number(form.total) < 1 || Number(form.maintenance || 0) > Number(form.total)) return setError('Enter a valid quantity and maintenance amount.')
    if (!form.location?.trim()) return setError('Storage location is required.')
    save({ ...form, name: form.name.trim(), total: Number(form.total), maintenance: Number(form.maintenance || 0), maxDays: Number(form.maxDays || 1), id: form.id || `gear-${Date.now()}`, art: form.art || 'Board', category: form.category || categories[0], rating: form.rating || 4.8, society: form.society || societies[0], description: form.description || `${form.name} is shared by ${form.society || societies[0]} for campus projects and events.`, specs: form.specs || { Included: 'Demo listing' }, manager: form.manager || { name: 'Aarav Mehta', email: 'society.manager@campusvault.demo' }, rules: Array.isArray(form.rules) ? form.rules : ['Bring your student ID when collecting.'] })
  }
  return <div className="modal-backdrop"><div className="resource-modal"><div className="modal-top"><div><div className="eyebrow"><span className="eyebrow-line" /> INVENTORY</div><h2>{form.id ? 'Edit resource' : 'Add a resource'}</h2></div><button className="icon-button" onClick={close}><X /></button></div><div className="resource-form-grid"><label>Resource name<input value={form.name || ''} onChange={(event) => set('name', event.target.value)} /></label><label>Category<select value={form.category || categories[0]} onChange={(event) => set('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Society<select value={form.society || societies[0]} onChange={(event) => set('society', event.target.value)}>{societies.map((name) => <option key={name}>{name}</option>)}</select></label><label>Total quantity<input type="number" min="1" value={form.total || 1} onChange={(event) => set('total', event.target.value)} /></label><label>Condition<select value={form.condition || 'Excellent'} onChange={(event) => set('condition', event.target.value)}>{['Like New', 'Excellent', 'Good', 'Fair'].map((condition) => <option key={condition}>{condition}</option>)}</select></label><label>Storage location<input value={form.location || ''} onChange={(event) => set('location', event.target.value)} /></label><label>Max borrowing days<input type="number" min="1" max="30" value={form.maxDays || 7} onChange={(event) => set('maxDays', event.target.value)} /></label><label>Units under maintenance<input type="number" min="0" value={form.maintenance || 0} onChange={(event) => set('maintenance', event.target.value)} /></label><label className="full-span">Description<textarea rows="2" value={form.description || ''} onChange={(event) => set('description', event.target.value)} /></label></div>{error && <div className="form-error"><CircleAlert size={15} />{error}</div>}<div className="modal-actions"><button className="button button-light" onClick={close}>Cancel</button><button className="button button-dark" onClick={submit}>{form.id ? 'Save changes' : 'Add resource'} <Check size={15} /></button></div></div></div>
}

function RequestsPage({ bookings, resources, approve, reject, society }) {
  const [filter, setFilter] = useState('All')
  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Checked Out', 'Returned', 'Cancelled']
  const [reasonId, setReasonId] = useState(null)
  const [reason, setReason] = useState('')
  const current = bookings.filter((booking) => filter === 'All' || (filter === 'Checked Out' ? ['checked_out', 'overdue'].includes(booking.status) : booking.status === filter.toLowerCase()))
  const submitReject = () => { reject(reasonId, reason); setReasonId(null); setReason('') }
  return <div className="manager-page-content"><div className="manager-toolbar"><div><h2>Booking requests <span className="soft-count">{bookings.length}</span></h2><p>Review and manage requests for {society}.</p></div></div><div className="tabs-scroll manager-tabs">{tabs.map((name) => <button key={name} className={filter === name ? 'active' : ''} onClick={() => setFilter(name)}>{name}</button>)}</div>
    <div className="request-table-wrap"><table className="data-table"><thead><tr><th>Student</th><th>Resource</th><th>Booking period</th><th>Purpose</th><th>Status</th><th>Actions</th></tr></thead><tbody>{current.map((booking) => <tr key={booking.id}><td><div className="student-cell"><span className="avatar">{booking.student.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><b>{booking.student}</b><small>Requested {displayDate(booking.createdAt)}</small></span></div></td><td><b>{resources.find((item) => item.id === booking.resourceId)?.name}</b><small>{booking.quantity} unit{booking.quantity > 1 ? 's' : ''}</small></td><td>{displayDate(booking.startDate)}<small>to {displayDate(booking.endDate)} · {booking.startTime}</small></td><td className="purpose-cell">{booking.purpose}</td><td><span className={statusClass(booking.status)}><i />{statusNames[booking.status]}</span></td><td>{booking.status === 'pending' ? <div className="table-actions"><button className="icon-button reject-button" title="Reject request" onClick={() => { setReasonId(booking.id); setReason('') }}><X size={15} /></button><button className="icon-button approve-button" title="Approve request" onClick={() => approve(booking.id)}><Check size={15} /></button></div> : <span className="muted">—</span>}</td></tr>)}</tbody></table>{!current.length && <div className="empty-mini">No bookings in this view yet.</div>}</div>
    {reasonId && <div className="modal-backdrop"><div className="simple-modal"><div className="modal-top"><div><div className="eyebrow"><span className="eyebrow-line" /> REQUEST DECISION</div><h2>Reject this request?</h2></div><button className="icon-button" onClick={() => setReasonId(null)}><X /></button></div><label>Reason for rejection <span className="optional">OPTIONAL</span><textarea rows="3" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Let the student know why..." /></label><div className="modal-actions"><button className="button button-light" onClick={() => setReasonId(null)}>Go back</button><button className="button button-dark" onClick={submitReject}>Reject request <X size={14} /></button></div></div></div>}
  </div>
}

function IssuedPage({ bookings, resources, checkout }) {
  const [filter, setFilter] = useState('All')
  const issued = bookings.filter((booking) => ['approved', 'checked_out', 'overdue'].includes(booking.status))
    .filter((booking) => filter === 'All' || (filter === 'Ready for pickup' ? booking.status === 'approved' : ['checked_out', 'overdue'].includes(booking.status)))
  return <div className="manager-page-content"><div className="manager-toolbar"><div><h2>Issued equipment</h2><p>Approval is not collection — record each physical handoff.</p></div></div><div className="tabs-scroll manager-tabs">{['All', 'Ready for pickup', 'Checked out'].map((name) => <button key={name} className={filter === name ? 'active' : ''} onClick={() => setFilter(name)}>{name}</button>)}</div><div className="issued-list">{issued.length ? issued.map((booking) => <div className="issued-card" key={booking.id}><div className="issued-person"><span className="avatar">{booking.student.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><b>{booking.student}</b><small>{booking.id} · {booking.quantity} unit{booking.quantity > 1 ? 's' : ''}</small></div></div><div><small>RESOURCE</small><b>{resources.find((item) => item.id === booking.resourceId)?.name}</b></div><div><small>COLLECTED / COLLECTION</small><b>{displayDate(booking.startDate)} · {booking.startTime}</b></div><div><small>EXPECTED RETURN</small><b>{displayDate(booking.endDate)} · {booking.endTime}</b></div><div><span className={statusClass(booking.status)}><i />{statusNames[booking.status]}</span></div>{booking.status === 'approved' ? <button className="button button-dark button-small" onClick={() => checkout(booking.id)}>Mark as checked out <ArrowRight size={14} /></button> : <span className="checked-out-note"><CheckCircle2 size={14} /> Issued</span>}</div>) : <div className="empty-state"><div className="empty-icon"><TicketCheck /></div><h3>No equipment to issue</h3><p>Approved bookings waiting for pickup will appear here.</p></div>}</div></div>
}

function ReturnsPage({ bookings, resources, confirmReturn }) {
  const returns = bookings.filter((booking) => ['checked_out', 'overdue'].includes(booking.status) || booking.returnRequested)
  return <div className="manager-page-content"><div className="manager-toolbar"><div><h2>Returns <span className="soft-count">{returns.length}</span></h2><p>Confirm the equipment is physically back before closing a loan.</p></div></div>{returns.length ? <div className="return-list">{returns.map((booking) => <div className="return-card" key={booking.id}><ProductArt item={resources.find((item) => item.id === booking.resourceId)} /><div className="return-card-main"><span className={statusClass(booking.status)}><i />{booking.returnRequested ? 'Return requested' : statusNames[booking.status]}</span><h3>{resources.find((item) => item.id === booking.resourceId)?.name}</h3><p>{booking.student} · {booking.quantity} unit{booking.quantity > 1 ? 's' : ''}</p><small>Due {displayDate(booking.endDate)} · Ref. {booking.id}</small></div><div className="return-card-actions">{booking.returnRequested && <span className="return-request-tag"><RotateCcw size={13} /> Member requested return</span>}<button className="button button-dark button-small" onClick={() => confirmReturn(booking.id)}>Confirm physical return <Check size={14} /></button></div></div>)}</div> : <div className="empty-state"><div className="empty-icon"><RotateCcw /></div><h3>All equipment is accounted for.</h3><p>Active loans and member return requests will show up here.</p></div>}</div>
}

function AnalyticsPage({ bookings, resources }) {
  const [range, setRange] = useState('All time')
  const filtered = range === 'All time' ? bookings : bookings.filter((booking) => booking.createdAt >= daysFromToday(range === '30 days' ? -30 : -7))
  const categoryData = categories.map((category) => ({ name: category.replace(' & ', ' / '), value: resources.filter((item) => item.category === category).length }))
  const popular = resources.map((item) => ({ name: item.name, count: bookings.filter((booking) => booking.resourceId === item.id && !['rejected', 'cancelled'].includes(booking.status)).length })).sort((a, b) => b.count - a.count).slice(0, 5)
  const borrowed = filtered.filter((booking) => !['rejected', 'cancelled'].includes(booking.status)).length
  const approved = filtered.filter((booking) => ['approved', 'checked_out', 'overdue', 'returned'].includes(booking.status)).length
  const overdue = filtered.filter((booking) => booking.status === 'overdue' || (booking.status === 'checked_out' && booking.endDate < today)).length
  const monthlyData = Array.from({ length: 6 }, (_, index) => { const date = new Date(); date.setMonth(date.getMonth() - (5 - index)); const month = date.toLocaleDateString('en-IN', { month: 'short' }); return { month, bookings: filtered.filter((booking) => new Date(`${booking.createdAt}T12:00:00`).getMonth() === date.getMonth()).length } })
  return <div className="manager-page-content"><div className="manager-toolbar"><div><h2>Resource analytics</h2><p>See how your society’s equipment is being used.</p></div><label className="chart-period"><select value={range} onChange={(event) => setRange(event.target.value)}><option>All time</option><option>30 days</option><option>7 days</option></select><ChevronDown size={12} /></label></div><div className="stats-grid analytics-stats"><div className="stat-card"><span className="stat-icon"><Activity size={18} /></span><span className="stat-label">Total requests</span><b>{borrowed}</b><small>in selected period</small></div><div className="stat-card"><span className="stat-icon"><CheckCircle2 size={18} /></span><span className="stat-label">Approval rate</span><b>{borrowed ? `${Math.round(approved / borrowed * 100)}%` : '—'}</b><small>approved requests</small></div><div className="stat-card"><span className="stat-icon"><RotateCcw size={18} /></span><span className="stat-label">Return rate</span><b>{borrowed ? `${Math.round(filtered.filter((b) => b.status === 'returned').length / borrowed * 100)}%` : '—'}</b><small>successfully returned</small></div><div className="stat-card"><span className="stat-icon"><CircleAlert size={18} /></span><span className="stat-label">Overdue loans</span><b>{overdue}</b><small>need follow-up</small></div></div><div className="analytics-grid"><section className="manager-panel wide-chart"><div className="panel-title"><div><h3>Borrowing activity</h3><p>Requests created per month.</p></div><span className="chart-period">LAST 6 MONTHS</span></div><div className="chart-body"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthlyData}><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} /><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--text)' }} /><Line type="monotone" dataKey="bookings" stroke="#10a56c" strokeWidth={3} dot={{ r: 4, fill: '#10a56c' }} /></LineChart></ResponsiveContainer></div></section><section className="manager-panel"><div className="panel-title"><div><h3>Most borrowed</h3><p>By request count.</p></div></div>{popular.map((item, index) => <div className="popular-row" key={item.name}><span>0{index + 1}</span><b>{item.name}</b><strong>{item.count}</strong></div>)}</section><section className="manager-panel category-chart"><div className="panel-title"><div><h3>Popular categories</h3><p>Resources by category.</p></div></div><div className="chart-body"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={78} paddingAngle={3}>{categoryData.map((entry, index) => <Cell key={entry.name} fill={['#10a56c', '#f5b544', '#6587df', '#eb8d92', '#28a7bb', '#a288d0'][index]} />)}</Pie><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--text)' }} /></PieChart></ResponsiveContainer></div></section><section className="manager-panel"><div className="panel-title"><div><h3>Equipment utilisation</h3><p>Share of total equipment units.</p></div></div>{resources.slice(0, 5).map((item) => { const used = bookings.filter((booking) => booking.resourceId === item.id && isActiveBooking(booking)).reduce((sum, booking) => sum + booking.quantity, 0); return <div className="util-row" key={item.id}><div><b>{item.name}</b><span>{used} / {item.total} units in use</span></div><div className="util-track"><i style={{ width: `${Math.min(100, used / item.total * 100)}%` }} /></div></div> })}</section></div></div>
}

function SettingsPage({ society, resources }) {
  return <div className="manager-page-content"><div className="manager-toolbar"><div><h2>Society settings</h2><p>Demo information for your CampusVault society profile.</p></div></div><div className="settings-card"><div className="settings-emblem"><VaultIcon /></div><div className="settings-main"><span className="section-kicker">TIET · VERIFIED DEMO SOCIETY</span><h2>{society}</h2><p>Share equipment, support student projects, and make campus resources easier to access.</p><div className="settings-metrics"><span><b>{resources.length}</b> listed resources</span><span><b>{resources.reduce((sum, item) => sum + item.total, 0)}</b> total units</span><span><b>Aarav Mehta</b> society manager</span></div><div className="demo-notice"><ShieldCheck size={16} /> This prototype uses fictional demo records and local browser storage. No real account or society data is connected.</div></div></div></div>
}

function NotFound() {
  return <main className="page-main container"><div className="empty-state"><div className="empty-icon"><CircleAlert /></div><h3>This gear isn't in the vault.</h3><p>It may have been removed or the link is out of date.</p><Link className="button button-dark" to="/">Back to explore <ArrowRight size={15} /></Link></div></main>
}

function App() {
  const vault = useVault()
  const [theme, setThemeState] = useState(() => localStorage.getItem('campusvault-theme') || 'light')
  const [role, setRoleState] = useState(() => localStorage.getItem('campusvault-role') || 'student')
  const [society, setSocietyState] = useState(() => localStorage.getItem('campusvault-society') || societies[0])
  const [compared, setCompared] = useState(() => JSON.parse(localStorage.getItem('campusvault-compared') || '[]'))
  const [passBooking, setPassBooking] = useState(null)
  const [bookingItem, setBookingItem] = useState(null)
  const [toast, setToast] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const saved = vault.saved || []
  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.dataset.theme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
    localStorage.setItem('campusvault-theme', theme)
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const update = () => { document.documentElement.dataset.theme = media.matches ? 'dark' : 'light' }
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }
  }, [theme])
  useEffect(() => localStorage.setItem('campusvault-compared', JSON.stringify(compared)), [compared])
  useEffect(() => { localStorage.setItem('campusvault-role', role) }, [role])
  useEffect(() => { localStorage.setItem('campusvault-society', society) }, [society])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer) } }, [toast])
  const setRole = (value) => { setRoleState(value); if (value === 'manager') navigate('/manager'); else if (location.pathname.startsWith('/manager')) navigate('/') }
  const toggleSaved = (id) => vault.update('saved', (current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id])
  const toggleCompare = (id) => setCompared((current) => {
    if (current.includes(id)) return current.filter((itemId) => itemId !== id)
    if (current.length >= 3) { setToast('Compare up to three resources at a time.'); return current }
    return [...current, id]
  })
  const openBooking = (item) => setBookingItem(item)
  const createBooking = (form) => {
    const item = vault.resources.find((resource) => resource.id === form.resourceId)
    const available = getAvailability(item, vault.bookings, form.startDate, form.endDate)
    if (form.quantity > available) { setToast(`Only ${available} unit${available === 1 ? '' : 's'} remain for those dates.`); return }
    const booking = { ...form, id: makeId(), student: currentStudent, society: item.society, status: 'pending', createdAt: today, returnRequested: false }
    vault.update('bookings', (all) => [booking, ...all])
    vault.addNotice(`${item.name} request sent to ${item.society}.`, booking.id, 'student')
    vault.addNotice(`New request for ${item.name} from ${currentStudent}.`, booking.id, 'manager')
    vault.addActivity(`${currentStudent} requested ${item.name} (${booking.quantity} unit${booking.quantity > 1 ? 's' : ''}).`, item.society)
    setBookingItem(null)
    setToast('Request sent. The society manager will review it shortly.')
    navigate('/bookings')
  }
  const actBooking = (id, status, message, rejectionReason = '') => {
    const booking = vault.bookings.find((entry) => entry.id === id)
    if (!booking) return
    if (status === 'approved') {
      const item = vault.resources.find((resource) => resource.id === booking.resourceId)
      const available = getAvailability(item, vault.bookings, booking.startDate, booking.endDate, booking.id)
      if (available < booking.quantity) { setToast(`Approval failed: only ${available} units are available for the requested period.`); return }
    }
    vault.update('bookings', (all) => all.map((entry) => entry.id === id ? { ...entry, status, rejectionReason } : entry))
    vault.addNotice(message, id, 'student')
    vault.addActivity(message, booking.society)
    setToast(message)
  }
  const approve = (id) => actBooking(id, 'approved', 'Your equipment request has been approved. Your digital borrowing pass is ready.')
  const reject = (id, reason) => actBooking(id, 'rejected', reason ? `Your request was declined: ${reason}` : 'Your equipment request was declined.', reason)
  const cancelBooking = (id) => {
    const booking = vault.bookings.find((entry) => entry.id === id)
    if (!booking || !['pending', 'approved'].includes(booking.status)) return
    vault.update('bookings', (all) => all.map((entry) => entry.id === id ? { ...entry, status: 'cancelled' } : entry))
    vault.addNotice(`Booking ${id} has been cancelled by the member.`, id, 'manager')
    vault.addActivity(`${booking.student} cancelled booking ${id}.`, booking.society)
    setToast('Booking cancelled.')
  }
  const checkout = (id) => {
    const booking = vault.bookings.find((entry) => entry.id === id)
    if (!booking || booking.status !== 'approved') return
    actBooking(id, 'checked_out', 'Your equipment is checked out. Have a great project!')
  }
  const requestReturn = (id) => {
    const booking = vault.bookings.find((entry) => entry.id === id)
    if (!booking || !['checked_out', 'overdue'].includes(booking.status)) return
    vault.update('bookings', (all) => all.map((entry) => entry.id === id ? { ...entry, returnRequested: true } : entry))
    vault.addNotice(`${booking.student} requested to return booking ${id}.`, id, 'manager')
    vault.addActivity(`${booking.student} requested a return for booking ${id}.`, booking.society)
    setToast('Return request sent to the society.')
  }
  const confirmReturn = (id) => {
    const booking = vault.bookings.find((entry) => entry.id === id)
    if (!booking || !['checked_out', 'overdue'].includes(booking.status)) return
    vault.update('bookings', (all) => all.map((entry) => entry.id === id ? { ...entry, status: 'returned', returnRequested: false, returnedAt: today } : entry))
    vault.addNotice(`Your ${vault.resources.find((item) => item.id === booking.resourceId)?.name} has been marked as returned.`, id, 'student')
    vault.addActivity(`${booking.student} returned ${vault.resources.find((item) => item.id === booking.resourceId)?.name}.`, booking.society)
    setToast('Return confirmed. Inventory has been updated.')
  }
  const editResource = (resource) => {
    vault.update('resources', (all) => all.some((item) => item.id === resource.id) ? all.map((item) => item.id === resource.id ? resource : item) : [resource, ...all])
    vault.addActivity(`${resource.name} inventory details were updated.`, resource.society)
    setToast('Inventory saved.')
  }
  const deleteResource = (id) => {
    const resource = vault.resources.find((item) => item.id === id)
    if (!resource || vault.bookings.some((booking) => booking.resourceId === id && isActiveBooking(booking))) { setToast('This resource has active bookings and cannot be deleted.'); return }
    vault.update('resources', (all) => all.filter((item) => item.id !== id))
    setToast('Resource removed from inventory.')
  }
  const markRead = () => vault.update('notifications', (all) => all.map((notice) => ({ ...notice, read: true })))
  const manager = role === 'manager'
  const showPass = (booking) => setPassBooking(booking)
  return <>
    {!manager && <Header theme={theme} setTheme={setThemeState} role={role} setRole={setRole} society={society} setSociety={setSocietyState} notifications={vault.notifications || []} markRead={markRead} savedCount={saved.length} />}
    {manager && location.pathname.startsWith('/manager') && <Header theme={theme} setTheme={setThemeState} role={role} setRole={setRole} society={society} setSociety={setSocietyState} notifications={vault.notifications || []} markRead={markRead} savedCount={saved.length} />}
    <Routes>
      <Route path="/" element={<HomePage vault={vault} saved={saved} compared={compared} toggleSaved={toggleSaved} toggleCompare={toggleCompare} openBooking={openBooking} role={role} />} />
      <Route path="/gear/:id" element={<DetailPage vault={vault} saved={saved} compared={compared} toggleSaved={toggleSaved} toggleCompare={toggleCompare} openBooking={openBooking} />} />
      <Route path="/compare" element={<ComparePage vault={vault} compared={compared} toggleCompare={toggleCompare} toggleSaved={toggleSaved} saved={saved} openBooking={openBooking} />} />
      <Route path="/bookings" element={<BookingsPage vault={vault} cancelBooking={cancelBooking} requestReturn={requestReturn} showPass={showPass} />} />
      <Route path="/saved" element={<SavedPage vault={vault} saved={saved} toggleSaved={toggleSaved} toggleCompare={toggleCompare} compared={compared} openBooking={openBooking} />} />
      <Route path="/manager/*" element={<ManagerLayout vault={vault} society={society} setSociety={setSocietyState} approve={approve} reject={reject} checkout={checkout} confirmReturn={confirmReturn} editResource={editResource} deleteResource={deleteResource} role={role} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    {!manager && <nav className="mobile-bottom-nav"><NavLink to="/" end><Search size={18} /><span>Explore</span></NavLink><NavLink to="/bookings"><ClipboardList size={18} /><span>Bookings</span></NavLink><NavLink to="/saved"><Bookmark size={18} /><span>Saved</span></NavLink><NavLink to="/compare"><ArrowDownUp size={18} /><span>Compare</span></NavLink></nav>}
    {compared.length >= 2 && !location.pathname.startsWith('/manager') && location.pathname !== '/compare' && <div className="compare-float"><span className="compare-float-icon"><ArrowDownUp size={17} /></span><span><b>{compared.length} items ready</b><small>Compare side by side</small></span><Link to="/compare" className="button button-dark button-small">Compare gear <ArrowRight size={14} /></Link><button className="icon-button" onClick={() => setCompared([])} aria-label="Clear comparison"><X size={15} /></button></div>}
    {bookingItem && <BookingModal item={bookingItem} vault={vault} close={() => setBookingItem(null)} createBooking={createBooking} />}
    {passBooking && <PassModal booking={passBooking} item={vault.resources.find((resource) => resource.id === passBooking.resourceId)} close={() => setPassBooking(null)} />}
    {toast && <div className="toast"><CheckCircle2 size={17} /><span>{toast}</span><button className="icon-button" onClick={() => setToast('')}><X size={15} /></button></div>}
    <footer className="site-footer"><span><span className="footer-mark"><VaultIcon /></span> © 2026 CampusVault · A TIET demo project</span><span>Shared gear. Bigger ideas. <span>✦</span></span></footer>
  </>
}

export default App
