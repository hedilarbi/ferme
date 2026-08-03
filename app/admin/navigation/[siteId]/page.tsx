import { prisma } from "@/lib/db";
import { addNavigationItem, deleteNavigationItem } from "@/lib/admin/navigation-actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SiteNavigationEditor({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: {
      navigationItems: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!site) notFound();

  const addAction = addNavigationItem.bind(null, siteId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/navigation" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Menu</h1>
          <p className="text-slate-500 mt-1">Configure links for <span className="text-blue-600 font-medium">{site.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Links */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Active Links</h2>
            </div>
            
            {site.navigationItems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 italic">No links yet. Add your first link using the form.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {site.navigationItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="w-1 h-1 bg-slate-900 rounded-full"></span>
                        <span className="w-1 h-1 bg-slate-900 rounded-full"></span>
                        <span className="w-1 h-1 bg-slate-900 rounded-full"></span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{item.label}</span>
                        <span className="text-xs font-mono text-blue-500">{item.href}</span>
                      </div>
                    </div>
                    <form action={async () => { "use server"; await deleteNavigationItem(siteId, item.id); }}>
                      <button 
                        type="submit"
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        🗑️
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Link Form */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Add New Link</h2>
            
            <form action={addAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="label" className="text-xs font-bold text-slate-500 uppercase">Label</label>
                <input 
                  type="text" 
                  name="label" 
                  id="label" 
                  required
                  placeholder="Ex: Contact"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="href" className="text-xs font-bold text-slate-500 uppercase">URL / Path</label>
                <input 
                  type="text" 
                  name="href" 
                  id="href" 
                  required
                  placeholder="Ex: /contact"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="order" className="text-xs font-bold text-slate-500 uppercase">Order</label>
                <input 
                  type="number" 
                  name="order" 
                  id="order" 
                  defaultValue={site.navigationItems.length}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                Add to Menu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
