import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ReviewArticlePage({
  params,
}: {
  params: Promise<{ id: string, siteId: string }>;
}) {
  const { id: campaignId, siteId } = await params;

  const campaignArticle = await prisma.campaignArticle.findUnique({
    where: { 
      campaignId_siteId: { campaignId, siteId } 
    },
    include: {
      article: true,
      campaign: true,
    }
  });

  if (!campaignArticle || !campaignArticle.article) notFound();

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: { themeSettings: true }
  });

  if (!site) notFound();

  const publishArticle = async (formData: FormData) => {
    "use server";
    
    const articleId = campaignArticle.articleId!;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const slug = formData.get("slug") as string;

    await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        content,
        slug,
        status: "PUBLISHED",
        publishedAt: new Date(),
      }
    });

    await prisma.campaignArticle.update({
      where: { campaignId_siteId: { campaignId, siteId } },
      data: { status: "PUBLISHED" }
    });

    revalidatePath(`/admin/campaigns/${campaignId}`);
    redirect(`/admin/campaigns/${campaignId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/campaigns/${campaignId}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Review Article</h1>
            <p className="text-slate-500 mt-1">Site: <span className="text-blue-600 font-medium">{site.name}</span> • Campaign: {campaignArticle.campaign.name}</p>
          </div>
        </div>
      </div>

      <form action={publishArticle} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-slate-700">Article Title</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                required
                defaultValue={campaignArticle.article.title}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-lg outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-bold text-slate-700">URL Slug</label>
              <input 
                type="text" 
                name="slug" 
                id="slug" 
                required
                defaultValue={campaignArticle.article.slug}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-bold text-slate-700">Content (Markdown)</label>
              <textarea 
                name="content" 
                id="content" 
                required
                rows={25}
                defaultValue={campaignArticle.article.content}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white space-y-6 sticky top-24">
            <h2 className="font-bold border-b border-slate-800 pb-2">Publishing</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Status: Ready for review
              </div>
              
              <div className="p-4 bg-slate-800 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Design Context</p>
                <p className="text-sm font-medium text-blue-400">{site.themeSettings?.designKey || "default"}</p>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                  Publish Now
                </button>
                <button 
                  type="button"
                  className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-white transition-all active:scale-95"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
