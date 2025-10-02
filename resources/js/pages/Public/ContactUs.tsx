import PageTitle from '@/components/public-page-title';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Contact Us', href: route('contact-us') },
];

const ContactUS: React.FC = () => {
    return (
        <PublicLayout title="Contact Us">
            <div className="mx-auto max-w-7xl p-6 lg:p-8">
                <PageTitle title="Contact Us" breadcrumbs={breadcrumbs} subtitle="Get in touch with our team" />
                <ContactPage />
            </div>
        </PublicLayout>
    );
};

export default ContactUS;

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
    const [processing, setProcessing] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleChange = (field: keyof ContactFormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): Partial<Record<keyof ContactFormData, string>> => {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setProcessing(true);

        // Simulate API call - Replace with actual Inertia post in your project:
        // post('/contact', {
        //   preserveScroll: true,
        //   onSuccess: () => {
        //     reset();
        //     setSubmitted(true);
        //     setTimeout(() => setSubmitted(false), 5000);
        //   },
        // });

        setTimeout(() => {
            setProcessing(false);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });

            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <>
            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Contact Information */}
                    <div className="space-y-6 sm:col-span-1">
                        <div className="rounded-lg bg-card p-6 shadow-sm">
                            <h2 className="mb-6 text-xl font-semibold">Contact Information</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                        <Phone className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Phone</h3>
                                        <p className="mt-1 text-sm text-slate-600">+1 (555) 123-4567</p>
                                        <p className="text-sm text-slate-600">Mon-Fri 9am-6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                                        <Mail className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Email</h3>
                                        <p className="mt-1 text-sm text-slate-600">support@example.com</p>
                                        <p className="text-sm text-slate-600">We'll respond within 24hrs</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
                                        <MapPin className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Office</h3>
                                        <p className="mt-1 text-sm text-slate-600">123 Business Street</p>
                                        <p className="text-sm text-slate-600">City, State 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm">
                            <h3 className="mb-2 text-lg font-semibold">Need immediate help?</h3>
                            <p className="mb-4 text-sm text-blue-100">Check out our FAQ section or reach out to our support team directly.</p>
                            <Button variant="secondary" className="w-full">
                                Visit FAQ
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="rounded-lg bg-white p-8 shadow-md">
                            <h2 className="mb-2 text-2xl font-semibold">Send us a message</h2>
                            <p className="mb-6 text-slate-600">Fill out the form below and we'll get back to you as soon as possible.</p>

                            {submitted && (
                                <Alert className="mb-6 border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">
                                        Thank you for contacting us! We'll get back to you shortly.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="John Doe"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="john@example.com"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="0300 123 4567"
                                            className={errors.phone ? 'border-red-500' : ''}
                                        />
                                        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => handleChange('subject', e.target.value)}
                                            placeholder="How can we help?"
                                            className={errors.subject ? 'border-red-500' : ''}
                                        />
                                        {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => handleChange('message', e.target.value)}
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className={errors.message ? 'border-red-500' : ''}
                                    />
                                    {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-sm text-slate-600">* Required fields</p>
                                    <Button type="button" onClick={handleSubmit} disabled={processing} className="bg-primary">
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
