import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 flex flex-1 flex-col text-left text-xl leading-tight">
                <span className="truncate font-semibold text-foreground md:font-bold">Pak Quiz</span>
                <span className="truncate text-xs font-medium text-muted-foreground dark:text-gray-300">AI-Powered Learning</span>
            </div>
        </>
    );
}
