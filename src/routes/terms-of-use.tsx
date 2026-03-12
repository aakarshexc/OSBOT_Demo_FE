import { createFileRoute } from '@tanstack/react-router'
import { TermsOfUse } from '@/features/legal/TermsOfUse'

export const Route = createFileRoute('/terms-of-use')({
    component: TermsOfUse,
})
