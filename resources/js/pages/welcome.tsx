// import AppLayout from '@/layouts/app-layout';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quiz Tayari',
        href: '/',
    },
];

export default function Welcome() {
    // const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quiz Tayari">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                {/* <link rel="preconnect" href="https://fonts.bunny.net" />
                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" /> */}
            </Head>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* PlaceholderPattern component can be used here if needed */}
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* PlaceholderPattern component can be used here if needed */}
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* PlaceholderPattern component can be used here if needed */}
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {/* PlaceholderPattern component can be used here if needed */}
                </div>
            </div>
        </AppLayout>
    );
}

// <>
//             <Head title="Quiz Tayari">
//                 <link rel="preconnect" href="https://fonts.googleapis.com" />
//                 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//                 <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

//                 {/* <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" /> */}
//             </Head>
//             <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
//                 <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
//                     <nav className="flex items-center justify-end gap-4">
//                         {auth.user ? (
//                             <Link
//                                 href={route('dashboard')}
//                                 className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                             >
//                                 Dashboard
//                             </Link>
//                         ) : (
//                             <>
//                                 <Link
//                                     href={route('login')}
//                                     className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
//                                 >
//                                     Log in
//                                 </Link>
//                                 <Link
//                                     href={route('register')}
//                                     className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
//                                 >
//                                     Register
//                                 </Link>
//                             </>
//                         )}
//                     </nav>
//                 </header>
//                 <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
//                     <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
//                         <p className="mb-6 text-center font-[Roboto] text-sm leading-normal font-bold lg:mb-0 lg:text-left">
//                             Quiz Tayari is a platform for creating and taking quizzes. It is designed to be simple and easy to use, with a focus on
//                             providing a great user experience.
//                         </p>
//                         <AppShell variant="sidebar">
//                             <AppSidebar />
//                             <AppContent variant="sidebar" className="overflow-x-hidden">
//                                 <AppSidebarHeader breadcrumbs={breadcrumbs} />
//                                 {children}
//                             </AppContent>
//                         </AppShell>
//                     </main>
//                 </div>
//                 <div className="hidden h-14.5 lg:block"></div>
//             </div>
//         </>
