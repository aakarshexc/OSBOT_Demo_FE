import { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Scale, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/app-config'

interface LegalLayoutProps {
    children: ReactNode
    title: string
    description: string
    lastUpdated: string
}

export function LegalLayout({ children, title, description, lastUpdated }: LegalLayoutProps) {
    return (
        <div className='min-h-screen bg-background relative overflow-hidden flex flex-col'>
            {/* Background Elements - Similar to Sign In but more subtle for full page */}
            <div className='absolute inset-0 z-0 pointer-events-none'>
                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />

                {/* Abstract Shapes */}
                <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
                <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3' />
            </div>

            {/* Header */}
            <header className='relative z-10 border-b bg-background/80 backdrop-blur-md sticky top-0'>
                <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
                    <Link to='/sign-in' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm'>
                            <Scale className='h-5 w-5' />
                        </div>
                        <span className='font-heading font-bold text-lg'>{APP_NAME}</span>
                    </Link>

                    <div className='flex items-center gap-4'>
                        <Link to='/sign-in'>
                            <Button variant='ghost' size='sm' className='gap-2'>
                                <ArrowLeft className='h-4 w-4' />
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='relative z-10 flex-grow container mx-auto px-4 py-12 max-w-4xl'>
                <div className='space-y-4 mb-12 text-center'>
                    <h1 className='text-4xl sm:text-5xl font-heading font-bold tracking-tight text-foreground'>
                        {title}
                    </h1>
                    <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                        {description}
                    </p>
                    <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20'>
                        Last Updated: {lastUpdated}
                    </div>
                </div>

                <div className='prose prose-slate dark:prose-invert max-w-none bg-card rounded-xl border shadow-sm p-8 sm:p-12'>
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className='relative z-10 border-t bg-muted/30 py-12'>
                <div className='container mx-auto px-4 text-center'>
                    <div className='flex items-center justify-center gap-2 mb-4 opacity-50'>
                        <Scale className='h-5 w-5' />
                    </div>
                    <p className='text-sm text-muted-foreground mb-4'>
                        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </p>
                    <div className='flex justify-center gap-6 text-sm text-muted-foreground'>
                        <Link to='/privacy-policy' className='hover:text-primary transition-colors'>Privacy Policy</Link>
                        <Link to='/terms-of-use' className='hover:text-primary transition-colors'>Terms of Use</Link>
                        <a href='mailto:support@example.com' className='hover:text-primary transition-colors'>Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
