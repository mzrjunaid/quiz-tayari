<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- ✅ Primary Meta Tags --}}
    <meta
        name="description"
        content="Prepare for government and private job tests with PAK QUIZ. Access free MCQs, past papers, PPSC, FPSC, NTS, and entry test quizzes updated daily." />
    <meta name="keywords" content="Pakistan MCQs, PPSC jobs test, FPSC, NTS, online quiz, test preparation, government jobs, PAK QUIZ" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://www.pakquiz.com" />

    {/* ✅ Open Graph (for sharing) */}
    <meta property="og:title" content="PAK QUIZ - Pakistan’s #1 MCQs Preparation Website" />
    <meta
        property="og:description"
        content="Prepare for government and private job tests with free MCQs and past papers. Updated daily." />
    <meta property="og:image" content="https://www.pakquiz.com/logo.png" />
    <meta property="og:url" content="https://www.pakquiz.com" />
    <meta property="og:type" content="website" />

    {/* ✅ Twitter Cards */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PAK QUIZ - Pakistan’s #1 MCQs Preparation Website" />
    <meta
        name="twitter:description"
        content="Free MCQs, past papers, and job test quizzes. Prepare for government and private exams in Pakistan." />
    <meta name="twitter:image" content="https://www.pakquiz.com/logo.png" />

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Pak Quiz - Pakistan’s #1 MCQs Preparation Website') }}</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
