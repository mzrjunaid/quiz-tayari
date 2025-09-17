import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, UserCircle2 } from 'lucide-react';
import AppLogo from './app-logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { SidebarMenuButton, SidebarTrigger } from './ui/sidebar';
import { UserMenuContent } from './user-menu-content';

interface Props {
    setMcqMode: (mode: boolean) => void;
    mcqMode: boolean;
}

export default function PublicHeader({ mcqMode, setMcqMode }: Props) {
    const handleMcqToggle = (): void => {
        setMcqMode(!mcqMode);
    };
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    const getInitials = useInitials();
    return (
        <nav className="sticky top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-lg dark:bg-gray-900">
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
                    <div className="me-4 flex items-center space-x-4">
                        {auth.user ? (
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
                                    side="bottom"
                                >
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="link"
                                size="icon"
                                className="size-6 md:block md:size-8"
                                onClick={() => router.get(route('login'))}
                                asChild
                            >
                                <UserCircle2 />
                            </Button>
                        )}
                        {!isMobile && (
                            <Button variant="default" size="sm" onClick={handleMcqToggle}>
                                {mcqMode ? 'Reading Mode' : 'MCQ Mode'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
