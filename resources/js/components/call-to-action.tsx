import { Button } from './ui/button';

export default function CallToAction() {
    return (
        <section className="bg-accent px-4 py-16 text-accent-foreground sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="mb-6 text-4xl font-bold">Ready to Excel in Your Exams?</h2>
                <p className="mb-8 text-xl">Join thousands of students who have improved their scores with our AI-powered MCQ platform</p>
                <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <Button
                        variant="default"
                        size="lg"
                        className="rounded-2xl px-12 py-8 text-lg font-semibold transition-all"
                        // className="rounded-lg bg-white px-8 !py-4 text-lg font-semibold text-black transition-all hover:bg-gray-100"
                    >
                        Start Free Trial
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-2xl px-12 py-8 text-lg font-semibold transition-all">
                        View Demo
                    </Button>
                    {/* <button className="rounded-lg border border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-black">
                            View Pricing
                        </button> */}
                </div>
            </div>
        </section>
    );
}
