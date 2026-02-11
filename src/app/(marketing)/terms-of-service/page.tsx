import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function TermsOfService() {
    return (
        <main className="flex-1 py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-foreground">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <Alert className="mb-8">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        By using Axolhost services, you agree to these terms. Please read them carefully.
                    </AlertDescription>
                </Alert>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Service Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Axolhost provides Minecraft Java Edition server hosting services. Our service includes:
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• Minecraft server hosting on EU-based infrastructure</li>
                                <li>• Server management dashboard and console access</li>
                                <li>• SFTP and file management capabilities</li>
                                <li>• DDoS protection and security measures</li>
                                <li>• Customer support via email</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Account Registration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Account Security</h4>
                                <p className="text-muted-foreground">You are responsible for maintaining the security of your account credentials and all activities under your account.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Accurate Information</h4>
                                <p className="text-muted-foreground">You must provide accurate and complete information during registration and keep it updated.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Acceptable Use Policy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">You agree NOT to use our services for:</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• Illegal activities or content that violates applicable laws</li>
                                <li>• Harassment, hate speech, or discriminatory content</li>
                                <li>• Spamming, phishing, or other malicious activities</li>
                                <li>• Distributing malware or conducting DDoS attacks</li>
                                <li>• Mining cryptocurrency or resource-intensive non-gaming activities</li>
                                <li>• Hosting content that infringes intellectual property rights</li>
                                <li>• Adult content or services harmful to minors</li>
                                <li>• Reselling our services without written permission</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>4. Service Availability</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Uptime Target</h4>
                                <p className="text-muted-foreground">We aim for 99.9% uptime but cannot guarantee uninterrupted service due to maintenance, updates, or unforeseen circumstances.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Maintenance</h4>
                                <p className="text-muted-foreground">We may perform scheduled maintenance with advance notice. Emergency maintenance may occur without notice.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Resource Limits</h4>
                                <p className="text-muted-foreground">Server resources are allocated per plan. Excessive resource usage may result in temporary restrictions or account suspension.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>5. Payment and Billing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Subscription Model</h4>
                                <p className="text-muted-foreground">All plans are billed monthly in advance. Payment is due on the same date each month.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Payment Methods</h4>
                                <p className="text-muted-foreground">We accept major credit cards and wallets supported by our payment processor (Stripe).</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Failed Payments</h4>
                                <p className="text-muted-foreground">Services may be suspended if payment fails. Your server will be terminated if payment remains outstanding for 7 days.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Refunds</h4>
                                <p className="text-muted-foreground">No refunds for partial months. You may cancel anytime and service continues until the end of your billing period.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>6. Data and Backups</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Your Responsibility</h4>
                                <p className="text-muted-foreground">You are responsible for creating and maintaining backups of your server data.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Data Retention</h4>
                                <p className="text-muted-foreground">Server files are not retained after subscription cancellation or termination.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">No Backup Guarantee</h4>
                                <p className="text-muted-foreground">While we implement security measures, we do not guarantee data preservation and are not liable for data loss.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>7. Termination</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">By You</h4>
                                <p className="text-muted-foreground">You may cancel your subscription anytime through your account dashboard. Service continues until your billing period ends.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">By Us</h4>
                                <p className="text-muted-foreground">We may suspend or terminate accounts for violations of these terms, non-payment, or illegal activities.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Effect of Termination</h4>
                                <p className="text-muted-foreground">Upon termination, you lose access to your server and all associated data after the retention period.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>8. Changes to Terms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We may update these terms from time to time. Significant changes will be communicated via email with 30 days notice. Continued use constitutes acceptance of updated terms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>9. Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-muted-foreground">
                                <p><strong>Company:</strong> Axolhost</p>
                                <p><strong>Support Email:</strong> samuelmjordandev@gmail.com</p>
                                <p><strong>Legal Email:</strong> samuelmjordandev@gmail.com</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}