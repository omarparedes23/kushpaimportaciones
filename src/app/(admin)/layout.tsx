import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 text-xl font-bold border-b border-slate-700">
          Admin Panel
        </div>
        <nav className="flex flex-row md:flex-col gap-2 p-4 md:space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded bg-slate-800 hover:bg-slate-700">
            Products Dashboard
          </Link>
          <Link href="/" className="block px-4 py-2 rounded hover:bg-slate-700">
            Back to Store
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
