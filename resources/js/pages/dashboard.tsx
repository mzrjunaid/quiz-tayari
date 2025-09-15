import { SectionCards } from '@/components/section-cards';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { DashboardProps, Mcqs, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, latest_mcqs }: DashboardProps<Mcqs>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards stats={stats} />
                    </div>
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"></div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </div> */}
                        <h2 className="text-4xl font-semibold">Latest MCQs</h2>
                        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                            <Table>
                                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">#</TableHead>
                                        <TableHead>Question</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Topic</TableHead>
                                        <TableHead>Paper</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {latest_mcqs?.map((mcq, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="w-[10px] text-center">{index + 1}</TableCell>
                                            <TableCell className="w-[400px] break-words whitespace-normal">
                                                <Link href={route('mcqs.show', mcq.slug)} className="">
                                                    {mcq.question}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="w-[200px] break-words whitespace-normal">{mcq.subject}</TableCell>
                                            <TableCell className="w-[200px] break-words whitespace-normal">{mcq.topic}</TableCell>
                                            <TableCell className="w-[200px] break-words whitespace-normal">
                                                {mcq.paper ? mcq.paper.title : ''}
                                            </TableCell>
                                            <TableCell className="w-[200px] break-words whitespace-normal">
                                                {mcq.paper ? mcq.paper.department : ''}
                                            </TableCell>
                                            <TableCell className="w-[200px] text-center break-words whitespace-normal">
                                                {mcq.is_active && mcq.is_verified ? <Badge>Active</Badge> : <Badge>Inactive</Badge>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
