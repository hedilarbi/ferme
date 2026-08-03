/**
 * Shown when:
 * - The request hostname doesn't match any registered domain (site not found)
 * - Any route inside (site) calls notFound() and bubbles up here
 */
export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
          404
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Site not found
        </h1>
        <p className="text-gray-500 mb-8">
          The domain you&apos;re visiting isn&apos;t registered on this
          platform.
        </p>

        {/* Developer hint — visible in all environments */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-left text-sm text-gray-600 mb-8">
          <p className="font-semibold text-gray-700 mb-2">
            Running locally?
          </p>
          <p className="mb-1">
            Make sure you&apos;ve run{" "}
            <code className="bg-gray-100 rounded px-1">
              npx prisma db seed
            </code>{" "}
            and are accessing via a registered subdomain:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <code className="bg-gray-100 rounded px-1">
                deco-salon.localhost:3000
              </code>
            </li>
            <li>
              <code className="bg-gray-100 rounded px-1">
                guide-canape.localhost:3000
              </code>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
