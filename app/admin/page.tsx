import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [siteCount, articleCount, recentArticles] = await Promise.all([
    prisma.site.count(),
    prisma.article.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { site: true },
    }),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back to the platform administration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            🌐
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Sites</p>
            <p className="text-2xl font-bold text-slate-900">{siteCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
            📄
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Articles</p>
            <p className="text-2xl font-bold text-slate-900">{articleCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">
            👥
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Tenants</p>
            <p className="text-2xl font-bold text-slate-900">{siteCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent Articles</h2>
          <Link href="/admin/articles" className="text-sm text-blue-600 font-medium hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentArticles.map((article) => (
            <div key={article.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                  {article.status === "PUBLISHED" ? "✅" : "📝"}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{article.title}</h3>
                  <p className="text-sm text-slate-500">
                    On <span className="font-medium text-slate-700">{article.site.name}</span> • {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link 
                href={`/admin/articles/${article.id}/edit`}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Edit
              </Link>
            </div>
          ))}
          {recentArticles.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">
              No articles created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
