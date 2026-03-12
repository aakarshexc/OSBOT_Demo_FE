import { LegalLayout } from './components/LegalLayout'
import { APP_NAME } from '@/lib/app-config'

export function TermsOfUse() {
    return (
        <LegalLayout
            title="Terms of Use"
            description="These terms govern your use of our website and services. Please read them carefully."
            lastUpdated="February 11, 2026"
        >
            <div className="space-y-10">
                <section className="bg-muted/10 p-6 rounded-xl border border-border/40">
                    <h2 className="text-xl font-bold font-heading mb-3 text-primary">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        By accessing or using {APP_NAME} ("Service"), you agree to be bound by these Terms. If you disagree with any part of the terms,
                        then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-heading mb-3 text-primary flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary/10 rounded-full w-8 h-8 text-sm">2</span>
                        Changes to Terms
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                        What constitutes a material change will be determined at our sole discretion.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-heading mb-3 text-primary flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary/10 rounded-full w-8 h-8 text-sm">3</span>
                        Accounts & Responsibilities
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="border border-border/50 rounded-lg p-4 bg-background">
                            <h4 className="font-semibold mb-2 text-foreground">You Are Responsible For:</h4>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-muted-foreground">
                                <li>Safeguarding your password</li>
                                <li>All activities under your account</li>
                                <li>Notify us of any breach of security</li>
                            </ul>
                        </div>
                        <div className="border border-border/50 rounded-lg p-4 bg-background">
                            <h4 className="font-semibold mb-2 text-foreground">Prohibited Activities:</h4>
                            <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-muted-foreground">
                                <li>Reverse engineering the platform</li>
                                <li>Creating multiple fake accounts</li>
                                <li>Harassing other users</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-heading mb-3 text-primary flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary/10 rounded-full w-8 h-8 text-sm">4</span>
                        Intellectual Property
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of {APP_NAME} and its licensors.
                        The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-heading mb-3 text-primary flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary/10 rounded-full w-8 h-8 text-sm">5</span>
                        Links To Other Websites
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by {APP_NAME}.
                        <br className="mb-2 block" />
                        {APP_NAME} has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that {APP_NAME} shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-heading mb-3 text-primary flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary/10 rounded-full w-8 h-8 text-sm">6</span>
                        Limitation of Liability
                    </h2>
                    <div className="bg-muted/20 p-6 border-l-4 border-primary/50 text-muted-foreground italic rounded-r-lg">
                        In no event shall {APP_NAME}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                    </div>
                </section>

                <div className="pt-8 border-t">
                    <p className="text-center text-muted-foreground">
                        By using our services, you acknowledge that you have read these Terms of Use and agree to be bound by them.
                    </p>
                </div>
            </div>
        </LegalLayout>
    )
}
