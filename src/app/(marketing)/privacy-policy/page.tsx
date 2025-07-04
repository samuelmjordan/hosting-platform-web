import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
    return (
        <main className="flex-1 py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Information We Collect</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Account Information</h4>
                                <p className="text-muted-foreground">When you create an account, we collect your email address, username, and password through our auth provider.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Server Data</h4>
                                <p className="text-muted-foreground">We store your Minecraft server files, configurations, and logs to provide our hosting and backup services. This includes everything that exists on your container directory.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Usage Information</h4>
                                <p className="text-muted-foreground">We collect server performance metrics and usage statistics to maintain service quality and security.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. How We Use Your Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• Provide and maintain your Minecraft server hosting service</li>
                                <li>• Process payments and manage subscriptions</li>
                                <li>• Provide customer support and respond to inquiries</li>
                                <li>• Monitor server performance and prevent abuse</li>
                                <li>• Comply with legal obligations and prevent fraud</li>
                                <li>• Send service-related communications (server status, billing)</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Data Storage and Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Location</h4>
                                <p className="text-muted-foreground">All data is stored on servers within the European Union and the UK, ensuring GDPR compliance.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Security Measures</h4>
                                <p className="text-muted-foreground">We implement encryption, access controls, DDoS protection, and regular security audits to protect your data.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Retention</h4>
                                <p className="text-muted-foreground">Account data is retained while your account is active. Server files are deleted upon subscription termination.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>4. Your Rights (GDPR)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">As an EU resident, you have the right to:</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                                <li>• <strong>Rectification:</strong> Correct inaccurate personal data</li>
                                <li>• <strong>Erasure:</strong> Request deletion of your personal data</li>
                                <li>• <strong>Portability:</strong> Receive your data in a structured format</li>
                                <li>• <strong>Restriction:</strong> Limit how we process your data</li>
                                <li>• <strong>Objection:</strong> Object to processing of your data</li>
                                <li>• <strong>Withdraw consent:</strong> Withdraw consent at any time</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>5. Third-Party Services</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Payment Processing</h4>
                                <p className="text-muted-foreground">We use Stripe for payment processing. Your payment information is handled according to Stripe's privacy policy.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Authentication</h4>
                                <p className="text-muted-foreground">We use Clerk for user authentication. Account creation and login data is processed according to Clerk's privacy policy.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Analytics</h4>
                                <p className="text-muted-foreground">We may use privacy-compliant analytics tools to understand service usage and improve our platform.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>6. Cookies and Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">We use essential cookies for:</p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• User authentication and session management</li>
                                <li>• Security and fraud prevention</li>
                                <li>• Service functionality and preferences</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">We do not use tracking cookies for advertising purposes.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>7. Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-muted-foreground">
                                <p><strong>Data Controller:</strong> Axolhost</p>
                                <p><strong>Email:</strong> privacy@axolhost.com</p>
                                <p className="mt-4">For complaints about data processing, you may contact your local data protection authority.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>8. Changes to This Policy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">We may update this privacy policy from time to time. We will notify you of any significant changes by email or through our service.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}