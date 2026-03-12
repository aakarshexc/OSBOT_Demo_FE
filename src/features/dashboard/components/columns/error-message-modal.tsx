import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/utils/utils'

interface ErrorMessageModalProps {
    errorMessage: string
}

export function ErrorMessageModal({ errorMessage }: ErrorMessageModalProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <MessageSquare className="h-4 w-4" />
                    Message
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[70vw] max-w-[70vw] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0 w-full">
                    <DialogTitle>Error Message</DialogTitle>
                    <DialogDescription>
                        Detailed error information from the sync operation
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 min-h-0 px-6 pb-6 overflow-auto w-full">
                    <pre className={cn(
                        "text-sm font-mono whitespace-pre",
                        "leading-relaxed",
                        "bg-slate-950 dark:bg-slate-900 rounded-lg p-6 border border-slate-800",
                        "text-slate-100 dark:text-slate-200",
                        "block w-max min-w-full"
                    )}>
                        <code className="text-inherit whitespace-pre block">
                            {errorMessage.trim()}
                        </code>
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    )
}

