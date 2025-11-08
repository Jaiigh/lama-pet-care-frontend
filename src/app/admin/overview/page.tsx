'use client'
import React, { useState } from 'react'

type NavItem = {
    id: string
    label: string
    href?: string
}

const defaultItems: NavItem[] = [
    { id: 'overview', label: 'Overview', href: '/admin/overview' },
    { id: 'pets', label: 'Pets', href: '/admin/pets' },
    { id: 'appointments', label: 'Appointments', href: '/admin/appointments' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
]

function Sidebar({
    items = defaultItems,
    collapsed,
    onToggle,
}: {
    items?: NavItem[]
    collapsed: boolean
    onToggle: () => void
}) {
    return (
        <aside
            style={{
                width: collapsed ? 64 : 220,
                transition: 'width 200ms ease',
                background: '#0f172a',
                color: '#fff',
                height: '100vh',
                padding: '12px',
                boxSizing: 'border-box',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <button
                    onClick={onToggle}
                    aria-label="Toggle sidebar"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        marginRight: 8,
                    }}
                >
                    {collapsed ? '☰' : '✕'}
                </button>
                {!collapsed && <h1 style={{ fontSize: 16, margin: 0 }}>Admin</h1>}
            </div>

            <nav>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((it) => (
                        <li key={it.id} style={{ marginBottom: 8 }}>
                            <a
                                href={it.href}
                                style={{
                                    display: 'block',
                                    padding: '8px 10px',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    borderRadius: 6,
                                }}
                            >
                                <span style={{ marginRight: collapsed ? 0 : 8 }}>
                                    {/* simple icon placeholder */}
                                    {it.label.charAt(0).toUpperCase()}
                                </span>
                                {!collapsed && <span>{it.label}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default function Page() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />

            <main style={{ flex: 1, padding: 24, background: '#f8fafc' }}>
                <header style={{ marginBottom: 24 }}>
                    <h2 style={{ margin: 0 }}>Overview</h2>
                    <p style={{ margin: '8px 0 0', color: '#475569' }}>Admin dashboard overview and quick stats.</p>
                </header>

                <section
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 16,
                    }}
                >
                    <div style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: 0 }}>Total Pets</h3>
                        <p style={{ fontSize: 24, margin: '8px 0 0' }}>342</p>
                    </div>

                    <div style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: 0 }}>Appointments</h3>
                        <p style={{ fontSize: 24, margin: '8px 0 0' }}>18 today</p>
                    </div>

                    <div style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: 0 }}>Pending Requests</h3>
                        <p style={{ fontSize: 24, margin: '8px 0 0' }}>5</p>
                    </div>
                </section>

                <section style={{ marginTop: 24 }}>
                    <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
                        <h4 style={{ marginTop: 0 }}>Recent Activity</h4>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                            <li>New pet added: "Milo" — 2 hours ago</li>
                            <li>Appointment confirmed — 3 hours ago</li>
                            <li>Settings updated — 1 day ago</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    )
}