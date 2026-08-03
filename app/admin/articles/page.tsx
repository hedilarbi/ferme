import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteArticle } from "@/lib/admin/actions";

export default async function AdminArticlesList() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { site: true },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Articles</h1>
          <p className="text-slate-500 mt-1">Manage content across all your sites.</p>
        </div>
        <Link 
          href="/admin/articles/new" 
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Article</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Site</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/{article.slug}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {article.site.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-sm ${
                    article.status === "PUBLISHED" ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      article.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-500"
                    }`}></span>
                    {article.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/articles/${article.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      ✏️
                    </Link>
                    <form action={async () => { "use server"; await deleteArticle(article.id); }}>
                      <button 
                        type="submit"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  No articles found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
