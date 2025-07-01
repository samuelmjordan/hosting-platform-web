import Navbar from "@/app/_components/layout/navbar";

export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  Zap,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  MapPin,
  FileTerminal,
  SquareTerminal,
  Terminal,
  Pencil, Files
} from "lucide-react"
import Footer from "@/app/_components/layout/footer";
import {fetchPlans} from "@/app/_services/public/planService";
import {formatCurrency} from "@/app/_components/page/billing/utils/formatters";
import Console from "@/app/(panel)/[subscriptionUid]/console/page";

export default async function Home() {
  const { userId } = await auth()
  const plans = await fetchPlans('GAME_SERVER');
  const euroPlans = plans.filter(plan => plan.price.currency == "EUR");

  if (userId) {
    redirect("/store")
  }

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Support", href: "#support" },
  ]

  return (
      <div className="flex min-h-screen flex-col">
        <Navbar items={navItems} showAuth={true} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4 text-center">
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                🇪🇺 European Data Centers • GDPR Compliant
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 text-foreground">
                <span className="text-primary">AxolHost</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
                Premium Minecraft Java Edition server hosting designed for European players
              </p>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Lightning-fast servers, instant setup, and straightforward management. Get your Minecraft world online in
                under 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Your Server
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  No Setup Fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  24/7 Support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  99.9% Uptime
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose AxolHost?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Built specifically for Minecraft Java Edition with European players in mind
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>European Data Centers</CardTitle>
                    <CardDescription>
                      Servers located in Germany for low latency anywhere in Europe
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Instant Setup</CardTitle>
                    <CardDescription>
                      Your Minecraft server is ready in under 2 minutes with our one-click deployment
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>DDoS Protection</CardTitle>
                    <CardDescription>
                      Enterprise-grade DDoS protection keeps your server online even during attacks
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Server Console</CardTitle>
                    <CardDescription>
                      Monitor your server and run commands remotely via our in-browser console terminal
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Pencil className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Mod Support</CardTitle>
                    <CardDescription>
                      Choose one of our preset minecraft installations, or upload your own custom setups
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Files className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>SFTP</CardTitle>
                    <CardDescription>
                      Access your server via SFTP; or modify your files via our in-browser file explorer
                    </CardDescription>
                  </CardHeader>
                </Card>

              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h2>
                <p className="text-xl text-muted-foreground">No hidden fees. What you see, is what you get.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {euroPlans.map((plan) => (
                    <Card className="border">
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{plan.specification.title}</CardTitle>
                        <div className="text-4xl font-bold text-primary mt-4">{formatCurrency({type: plan.price.currency, value: plan.price.minor_amount})}</div>
                        <CardDescription className="text-base">per month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            {plan.specification.ram_gb}GB RAM
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            {plan.specification.ssd_gb}GB SSD storage
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-primary mr-3" />
                            DDoS protection
                          </li>
                        </ul>
                        <Button className="w-full mt-6">Choose Starter</Button>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section id="support" className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Trusted by European Minecraft Communities</h2>
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xl font-semibold text-foreground">4.9/5</span>
                  <span className="text-muted-foreground">(2,847 reviews)</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "Switched from another host and the difference is night and day. Server runs perfectly with 30+
                      players online."
                    </p>
                    <div className="font-semibold text-foreground">- Minecrafter_EU</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "Support team helped me set up my modpack in minutes. These guys know Minecraft inside and out."
                    </p>
                    <div className="font-semibold text-foreground">- BlockBuilder_DE</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "Best hosting in Europe. Low latency, great uptime, and the control panel is so easy to use."
                    </p>
                    <div className="font-semibold text-foreground">- CraftMaster_NL</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-background text-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Minecraft Adventure?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of European players who trust AxolHost with their Minecraft worlds
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignUpButton mode="modal">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    Start Your Server Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
  )
}