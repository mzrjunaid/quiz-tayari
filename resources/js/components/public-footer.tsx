import AppLogo from './app-logo';

export default function PublicFooter() {
    return (
        <footer className="border-t py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-6 md:grid md:grid-cols-4 md:gap-8">
                    <div>
                        <div className="mb-4 flex items-center space-x-3">
                            <AppLogo />
                        </div>
                        <p className="text-sm">AI-powered MCQ platform for comprehensive exam preparation.</p>
                    </div>

                    <div>
                        <h3 className="mb-3 font-semibold">Features</h3>
                        <ul className="space-y-2 text-sm">
                            <li>AI-Enhanced MCQs</li>
                            <li>Mock Tests</li>
                            <li>Custom Tests</li>
                            <li>Subject-Based Practice</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-3 font-semibold">Subjects</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Computer Science</li>
                            <li>Mathematics</li>
                            <li>Biology</li>
                            <li>Physics & Chemistry</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-3 font-semibold">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Help Center</li>
                            <li>Contact Us</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm">
                    <p>&copy; 2024 MCQ Master. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
