import { router } from '@inertiajs/react';
import { UserCircle2 } from 'lucide-react';
import AppLogo from './app-logo';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

export default function PublicHeader() {
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
                    <div className="flex items-center space-x-4">
                        <Button variant="link" size="icon" className="text-gray-800 md:block" onClick={() => router.get(route('login'))}>
                            <UserCircle2 className="size-6" />
                        </Button>
                        <Button variant="outline" size="sm" className="hidden text-gray-800 lg:block">
                            Get Started
                        </Button>
                        {/* <button className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-all hover:bg-gray-800">Get Started</button> */}
                    </div>
                </div>
            </div>
        </nav>
    );
}
