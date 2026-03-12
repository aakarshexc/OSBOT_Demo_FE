import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import ForgotPasswordModal from './components/ForgotPasswordModal'
import { Scale, Briefcase, FileText, Shield, Lock, Mail, Gavel, Users, TrendingUp } from 'lucide-react'
import { APP_NAME } from '@/lib/app-config'
import { Spinner } from '@/components/ui/spinner'

export function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const signIn = useAuthStore((state) => state.signIn)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const success = await signIn(email, password)
      if (success) {
        toast.success('Signed in successfully!')
        navigate({ to: '/dashboard' })
      } else {
        const errorMsg = 'Invalid email or password'
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred. Please try again.'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-background'>
      {/* Left Side - Login Form */}
      <div className='flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm'>
          {/* Logo/Brand */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='relative'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20'>
                  <Scale className='h-7 w-7' />
                </div>
                <div className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/80 animate-pulse' />
              </div>
              <h1 className='text-2xl font-heading font-bold text-foreground'>{APP_NAME}</h1>
            </div>
            <p className='text-sm text-muted-foreground'>Settlement Assistance & Legal Practice Management</p>
          </div>

          {/* Welcome Section */}
          <div className='mb-8'>
            <h2 className='text-3xl font-heading font-bold tracking-tight text-foreground mb-2'>
              Welcome Back
            </h2>
            <p className='text-muted-foreground'>
              Sign in to access your settlement assistance dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sm font-medium'>
                Email Address
              </Label>
              <div className='relative group'>
                <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  id='email'
                  type='email'
                  placeholder='lawyer@lawfirm.com'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMessage) {
                      setErrorMessage('')
                    }
                  }}
                  required
                  disabled={isLoading}
                  className={`pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20 ${errorMessage ? 'border-destructive' : ''}`}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-sm font-medium'>
                  Password
                </Label>
                <button
                  type='button'
                  onClick={() => setForgotOpen(true)}
                  className='text-sm font-medium text-primary hover:underline transition-all'
                >
                  Forgot password?
                </button>
              </div>
              <div className='relative group'>
                <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errorMessage) {
                      setErrorMessage('')
                    }
                  }}
                  required
                  disabled={isLoading}
                  className={`pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20 ${errorMessage ? 'border-destructive' : ''}`}
                />
              </div>
            </div>

            {errorMessage && (
              <div className='rounded-md bg-destructive/10 border border-destructive/20 p-3'>
                <p className='text-sm text-destructive font-medium'>
                  {errorMessage}
                </p>
              </div>
            )}

            <Button 
              type='submit' 
              className='w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all' 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className='mr-2 h-4 w-4' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Trust Indicators */}
          <div className='mt-8 pt-6 border-t'>
            <p className='text-xs text-muted-foreground text-center mb-4'>
              Trusted by leading law firms
            </p>
            <div className='flex items-center justify-center gap-6 opacity-60'>
              <Shield className='h-5 w-5 text-primary' />
              <Briefcase className='h-5 w-5 text-primary' />
              <FileText className='h-5 w-5 text-primary' />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual/Illustration */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0'>
          {/* Grid Pattern */}
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
          
          {/* Animated Golden Accent Lines */}
          <div className='absolute top-20 right-20 w-64 h-1 bg-primary/20 rounded-full rotate-12 animate-pulse' />
          <div className='absolute top-40 right-40 w-48 h-1 bg-primary/15 rounded-full rotate-45 animate-pulse delay-300' />
          <div className='absolute bottom-32 left-32 w-56 h-1 bg-primary/20 rounded-full -rotate-12 animate-pulse delay-700' />
          
          {/* Floating Legal Document Icons */}
          <div className='absolute top-32 right-16 animate-float'>
            <FileText className='h-8 w-8 text-primary/20' />
          </div>
          <div className='absolute top-64 right-32 animate-float delay-500'>
            <Gavel className='h-6 w-6 text-primary/15' />
          </div>
          <div className='absolute bottom-48 left-24 animate-float delay-1000'>
            <Scale className='h-7 w-7 text-primary/20' />
          </div>
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16'>
          {/* Main Illustration Area */}
          <div className='mb-8'>
            <div className='flex items-center justify-center mb-8'>
              <div className='relative'>
                {/* Scales of Justice with Animation */}
                <div className='flex items-center justify-center'>
                  <div className='relative animate-gentle-bounce'>
                    <Scale className='h-32 w-32 text-primary drop-shadow-lg' strokeWidth={1.5} />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='h-16 w-0.5 bg-primary/30' />
                    </div>
                  </div>
                </div>
                {/* Decorative Rings */}
                <div className='absolute inset-0 -z-10 flex items-center justify-center'>
                  <div className='h-40 w-40 rounded-full border-2 border-primary/10 animate-ping' />
                </div>
                <div className='absolute inset-0 -z-10 flex items-center justify-center'>
                  <div className='h-48 w-48 rounded-full border border-primary/5' />
                </div>
              </div>
            </div>

            {/* Feature Highlights with Icons */}
            <div className='space-y-6'>
              <div className='flex items-start gap-4 group'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 shadow-sm'>
                  <Briefcase className='h-6 w-6' />
                </div>
                <div>
                  <h3 className='font-heading font-semibold text-foreground mb-1'>
                    Case Management
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Organize and track all your legal cases in one centralized platform
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4 group'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 shadow-sm'>
                  <FileText className='h-6 w-6' />
                </div>
                <div>
                  <h3 className='font-heading font-semibold text-foreground mb-1'>
                    Document Analytics
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Comprehensive insights and analytics for your legal practice
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4 group'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 shadow-sm'>
                  <Shield className='h-6 w-6' />
                </div>
                <div>
                  <h3 className='font-heading font-semibold text-foreground mb-1'>
                    Secure & Compliant
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Enterprise-grade security to protect your sensitive legal data
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Trust with Icons */}
          <div className='mt-12 pt-8 border-t border-border/50'>
            <div className='grid grid-cols-3 gap-6'>
              <div className='text-center group'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <Users className='h-5 w-5 text-primary/60' />
                  <div className='text-2xl font-heading font-bold text-primary'>10K+</div>
                </div>
                <div className='text-xs text-muted-foreground'>Legal Cases</div>
              </div>
              <div className='text-center group'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <Briefcase className='h-5 w-5 text-primary/60' />
                  <div className='text-2xl font-heading font-bold text-primary'>500+</div>
                </div>
                <div className='text-xs text-muted-foreground'>Law Firms</div>
              </div>
              <div className='text-center group'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <TrendingUp className='h-5 w-5 text-primary/60' />
                  <div className='text-2xl font-heading font-bold text-primary'>99.9%</div>
                </div>
                <div className='text-xs text-muted-foreground'>Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circles with Animation */}
        <div className='absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 right-1/3 h-32 w-32 rounded-full bg-primary/3 blur-2xl animate-pulse delay-500' />
      </div>

      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  )
}
