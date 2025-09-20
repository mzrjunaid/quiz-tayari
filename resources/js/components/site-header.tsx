import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, UserCircle2 } from 'lucide-react';
import AppLogo from './app-logo';
import AppMode from './app-mode';
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
    const cleanup = useMobileNavigation();
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    const getInitials = useInitials();
    return (
        <nav className="sticky top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-lg">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <SidebarTrigger className="ms-4 flex items-center transition-all md:left-0 xl:absolute" />
                    <Button variant="link" className="flex items-center space-x-3" asChild>
                        <Link href="/" prefetch>
                            <AppLogo />
                        </Link>
                    </Button>
                    <div className="hidden space-x-8 md:flex">
                        <Link className="block w-full" href={route('home')} prefetch onClick={cleanup}>
                            Home
                        </Link>
                        <Link href="#tests">Tests</Link>
                        <Link href="#subjects">Subjects</Link>
                        <Link href="#analytics">Analytics</Link>
                    </div>
                    <div className="me-4 flex items-center space-x-4">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="focus-visible:ring-0">
                                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg">{getInitials(auth.user.name)}</AvatarFallback>
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
                                className="text-foreground md:block md:size-6"
                                onClick={() => router.get(route('login'))}
                                asChild
                            >
                                <UserCircle2 />
                            </Button>
                        )}
                        {!isMobile && <AppMode mcqMode={mcqMode} setMcqMode={setMcqMode} />}
                    </div>
                </div>
            </div>
        </nav>
    );
}
