import { Head, Link } from '@inertiajs/react';

interface SearchItem {
    id: number;
    title: string;
    link: string;
}

interface Props {
    query: string;
    papers: SearchItem[];
    mcqs: SearchItem[];
    // jobs: SearchItem[];
}

export default function SearchIndex({ query, papers, mcqs }: Props) {
    const hasResults = papers.length || mcqs.length;

    return (
        <div className="mx-auto max-w-5xl p-6">
            <Head title={`Search results for "${query}"`} />

            <h1 className="mb-6 text-2xl font-bold">Search results for “{query}”</h1>

            {!hasResults ? (
                <p className="text-lg text-gray-500">No results found.</p>
            ) : (
                <div className="space-y-10">
                    {papers.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-xl font-semibold text-blue-600">📘 Papers</h2>
                            <ul className="space-y-2">
                                {papers.map((item) => (
                                    <li key={item.id}>
                                        <Link href={item.link} className="text-gray-800 underline hover:text-blue-700">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {mcqs.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-xl font-semibold text-green-600">🧠 MCQs</h2>
                            <ul className="space-y-2">
                                {mcqs.map((item) => (
                                    <li key={item.id}>
                                        <Link href={item.link} className="text-gray-800 underline hover:text-green-700">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
