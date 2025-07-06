import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    FileText,
    Download,
    Trash2,
    Edit,
    Eye,
    MapPin,
    Lock,
    Mail
} from "lucide-react";

export default function GDPRCompliance() {
    return (
        <main className="flex-1 py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                        🇪🇺 GDPR Compliant
                    </Badge>
                    <h1 className="text-4xl font-bold mb-4 text-foreground">GDPR Compliance</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {"Your data rights matter. Here's how we protect your privacy and comply with GDPR regulations."}
                    </p>
                </div>

                <div className="space-y-8">
                    <Card className="border-green-200 bg-gradient-to-br from-accent/20 to-transparent">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle>Your Rights Under GDPR</CardTitle>
                                    <p className="text-muted-foreground">As an EU resident, you have comprehensive data protection rights</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Eye className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Right to Access</h4>
                                            <p className="text-sm text-muted-foreground">Request a copy of all personal data we hold about you</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Edit className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Right to Rectification</h4>
                                            <p className="text-sm text-muted-foreground">Correct any inaccurate personal information</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Trash2 className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Right to Erasure</h4>
                                            <p className="text-sm text-muted-foreground">Request deletion of your personal data</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Download className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Right to Portability</h4>
                                            <p className="text-sm text-muted-foreground">Receive your data in a structured, machine-readable format</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Lock className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Right to Restriction</h4>
                                            <p className="text-sm text-muted-foreground">Limit how we process your personal data</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Right to Object</h4>
                                            <p className="text-sm text-muted-foreground">Object to processing of your personal data</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>How We Protect Your Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold mb-2">EU Data Centers</h4>
                                    <p className="text-sm text-muted-foreground">All data stored exclusively in German data centers within the EU</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Encryption</h4>
                                    <p className="text-sm text-muted-foreground">Data encrypted in transit and at rest using industry standards</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Access Controls</h4>
                                    <p className="text-sm text-muted-foreground">Strict access controls and regular security audits</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Processing Lawful Basis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Contract Performance (Art. 6(1)(b))</h4>
                                    <p className="text-muted-foreground">{"Processing necessary to provide Minecraft hosting services you've subscribed to"}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Legitimate Interest (Art. 6(1)(f))</h4>
                                    <p className="text-muted-foreground">Service improvement, security monitoring, and fraud prevention</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Legal Obligation (Art. 6(1)(c))</h4>
                                    <p className="text-muted-foreground">Compliance with tax, accounting, and other legal requirements</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Consent (Art. 6(1)(a))</h4>
                                    <p className="text-muted-foreground">Marketing communications (where applicable, with explicit opt-in)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Retention Periods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <span className="font-medium">Account Information</span>
                                    <Badge variant="outline">While account is active</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <span className="font-medium">Server Files & Data</span>
                                    <Badge variant="outline">7 days after cancellation</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <span className="font-medium">Payment Records</span>
                                    <Badge variant="outline">7 years (legal requirement)</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <span className="font-medium">Support Communications</span>
                                    <Badge variant="outline">3 years</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <span className="font-medium">System Logs</span>
                                    <Badge variant="outline">90 days</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Third-Party Data Processors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Payment Processing - Stripe</h4>
                                    <p className="text-muted-foreground">EU-based payment processing with adequate safeguards and GDPR compliance</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Authentication - Clerk</h4>
                                    <p className="text-muted-foreground">User authentication service with GDPR-compliant data processing</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Infrastructure - Hetzner & Railway</h4>
                                    <p className="text-muted-foreground">Server hosting infrastructure located in Germany, The Netherlands, and Finland</p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    All third-party processors are bound by Data Processing Agreements (DPAs) ensuring GDPR compliance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cookies and Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Essential Cookies Only</h4>
                                    <p className="text-muted-foreground">We only use technically necessary cookies for authentication, security, and service functionality.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">No Tracking or Analytics Cookies</h4>
                                    <p className="text-muted-foreground">We do not use tracking cookies, advertising cookies, or third-party analytics that track users across sites.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Cookie Consent</h4>
                                    <p className="text-muted-foreground">Since we only use essential cookies, no consent banner is required under GDPR.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-4">
                                        For any data protection concerns, questions about your rights, or to exercise your GDPR rights, contact us.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Email:</strong> data@axolhost.com</p>
                                        <p><strong>Response Time:</strong> Within 30 days as required by GDPR</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Regular Updates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                We regularly review and update our data protection practices to ensure continued GDPR compliance.
                                Any significant changes will be communicated to you via email.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Last compliance review: {new Date().toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-12">
                        <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Your privacy is protected</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}