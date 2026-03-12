import { LegalLayout } from './components/LegalLayout'
import { APP_NAME } from '@/lib/app-config'

export function PrivacyPolicy() {
    return (
        <LegalLayout
            title="Privacy Policy"
            description="We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services."
            lastUpdated="February 11, 2026"
        >
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4 text-primary">1. Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Welcome to {APP_NAME}. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4 text-primary">2. Information We Collect</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="grid gap-4 md:grid-cols-2">
                        <li className="bg-muted/50 p-4 rounded-lg border border-border/50">
                            <span className="font-semibold block mb-1 text-foreground">Identity Data</span>
                            <span className="text-sm text-muted-foreground">Includes first name, last name, username or similar identifier.</span>
                        </li>
                        <li className="bg-muted/50 p-4 rounded-lg border border-border/50">
                            <span className="font-semibold block mb-1 text-foreground">Contact Data</span>
                            <span className="text-sm text-muted-foreground">Includes billing address, delivery address, email address and telephone numbers.</span>
                        </li>
                        <li className="bg-muted/50 p-4 rounded-lg border border-border/50">
                            <span className="font-semibold block mb-1 text-foreground">Technical Data</span>
                            <span className="text-sm text-muted-foreground">Includes IP address, your login data, browser type and version, time zone setting and location.</span>
                        </li>
                        <li className="bg-muted/50 p-4 rounded-lg border border-border/50">
                            <span className="font-semibold block mb-1 text-foreground">Usage Data</span>
                            <span className="text-sm text-muted-foreground">Includes information about how you use our website, products and services.</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4 text-primary">3. How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4 text-primary">4. Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                        <h3 className="font-semibold text-foreground mb-2">Our Commitment</h3>
                        <p className="text-sm text-muted-foreground">
                            We regularly review our security procedures and mechanisms to ensure your data remains protected against unauthorized access.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4 text-primary">5. Terms of Service</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Please also visit our Terms of Service section establishing the use, disclaimers, and limitations of liability governing the use of our website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-heading mb-4 text-primary">6. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        If you have any questions about this privacy policy, please contact us:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-muted/30 p-4 rounded-lg border text-center hover:border-primary/50 transition-colors">
                            <span className="text-sm font-medium text-muted-foreground block mb-1">Email</span>
                            <a href="mailto:privacy@osbot.com" className="text-primary font-semibold hover:underline">privacy@osbot.com</a>
                        </div>

                    </div>
                </section>
            </div>
        </LegalLayout>
    )
}
