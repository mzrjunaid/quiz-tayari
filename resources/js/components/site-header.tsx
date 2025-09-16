import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, UserCircle2 } from 'lucide-react';
import AppLogo from './app-logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { SidebarMenuButton, SidebarTrigger, useSidebar } from './ui/sidebar';
import { UserMenuContent } from './user-menu-content';

export default function PublicHeader() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();
    return (
        <nav className="sticky top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-lg">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <SidebarTrigger className="ms-4 flex h-full items-center transition-all md:left-0 xl:absolute" />
                    <div className="flex items-center space-x-3">
                        <AppLogo />
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                            <Brain className="h-6 w-6 text-white" />
                        </div> */}
                    </div>
                    <div className="hidden space-x-8 md:flex">
                        <a href="#mcqs" className="font-medium text-gray-700 transition-colors hover:text-black">
                            MCQs
                        </a>
                        <a href="#tests" className="font-medium text-gray-700 transition-colors hover:text-black">
                            Tests
                        </a>
                        <a href="#subjects" className="font-medium text-gray-700 transition-colors hover:text-black">
                            Subjects
                        </a>
                        <a href="#analytics" className="font-medium text-gray-700 transition-colors hover:text-black">
                            Analytics
                        </a>
                    </div>
                    {auth.user ? (
                        <div className="me-4 flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="focus-visible:ring-0">
                                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {!isMobile && (
                                            <>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-medium">{auth.user.name}</span>
                                                </div>
                                                <ChevronsUpDown className="ml-auto size-4" />
                                            </>
                                        )}
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                    align="end"
                                    side={isMobile ? 'bottom' : state === 'collapsed' ? 'bottom' : 'bottom'}
                                >
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <Button variant="link" size="icon" className="text-gray-800 md:block size-6" asChild>
                                <UserCircle2 className="" />
                            </Button> */}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Button variant="link" size="icon" className="text-gray-800 md:block" onClick={() => router.get(route('login'))}>
                                <UserCircle2 className="size-6" />
                            </Button>
                            <Button variant="outline" size="sm" className="hidden text-gray-800 lg:block">
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
