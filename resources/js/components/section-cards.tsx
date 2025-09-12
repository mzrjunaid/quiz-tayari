import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardProps } from '@/types';

export function SectionCards({ stats }: DashboardProps) {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total MCQs</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stats.mcqs_stats.total_mcqs}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    {/* <div className="line-clamp-1 flex gap-2 font-medium">Trending up this month</div> */}
                    <div className="text-muted-foreground">New MCQs / Rephrased MCQs</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Papers</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stats.mcqs_stats.total_papers}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="text-muted-foreground">New Total Papers</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Rephrased / Pending Rephrased</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.rephrase_stats.total_rephrased} / {stats.rephrase_stats.pending_count}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="text-muted-foreground">Old Database MCQs that needs to be rephrased.</div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Old MCQs</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{stats.mcqs_stats.old_mcqs}</CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="text-muted-foreground">Old Database MCQs</div>
                </CardFooter>
            </Card>
        </div>
    );
}
