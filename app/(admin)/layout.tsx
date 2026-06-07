import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-foreground tracking-tight">RUKA STUDIO</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block px-4 py-2 hover:bg-secondary rounded-none font-medium text-sm text-foreground transition-colors">Dashboard</Link>
          <Link href="/admin/projects" className="block px-4 py-2 hover:bg-secondary rounded-none font-medium text-sm text-foreground transition-colors">Proyek</Link>
          <Link href="/admin/content" className="block px-4 py-2 hover:bg-secondary rounded-none font-medium text-sm text-foreground transition-colors">Konten Web</Link>
          {session?.user?.role === 'OWNER' && (
            <Link href="/admin/users" className="block px-4 py-2 hover:bg-secondary rounded-none font-medium text-sm text-foreground transition-colors">Pengaturan User</Link>
          )}
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Placeholder */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-end px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-tight">{session?.user?.name || session?.user?.email}</span>
            <div className="w-8 h-8 rounded-none bg-primary text-white flex items-center justify-center text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
