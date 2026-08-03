import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-blue-600 p-1.5 rounded-lg">🚜</span>
            <span>Ferme Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/admin/articles" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            📄 Articles
          </Link>
          <Link 
            href="/admin/sites" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            🌐 Sites
          </Link>
          <Link 
            href="/admin/campaigns" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            🤖 Campagnes IA
          </Link>
          <Link 
            href="/admin/navigation" 
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            🗺️ Navigation
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-slate-500">Global Administration</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
