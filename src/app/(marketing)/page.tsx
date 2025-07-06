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
  ArrowRight,
  MapPin,
  Terminal,
  Pencil, Files
} from "lucide-react"
import {fetchPlans} from "@/app/_services/public/planService";
import {formatCurrency} from "@/app/_components/page/billing/utils/formatters";
import {STORE_PATH} from "@/app/constants";

export default async function Home() {
  const { userId } = await auth()
  const plans = await fetchPlans('GAME_SERVER');
  if (userId) {
    redirect(STORE_PATH)
  }

  return (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4 text-center">
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                🇪🇺 European Data Centers • GDPR Compliant
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 text-foreground">
                <span className="text-primary">Axolhost</span>
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
                  No Hidden Fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  No Player Limits
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  DDoS Protection
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose Axolhost?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Built specifically for Minecraft Java Edition with European players in mind
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>European Data Centers</CardTitle>
                    </div>
                    <CardDescription>
                      Servers located in Germany for low latency anywhere in Europe
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Instant Setup</CardTitle>
                    </div>
                    <CardDescription>
                      Your Minecraft server is ready in under 2 minutes with our one-click deployment
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>DDoS Protection</CardTitle>
                    </div>
                    <CardDescription>
                      Enterprise-grade DDoS protection keeps your server online even during attacks
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Terminal className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Server Console</CardTitle>
                    </div>
                    <CardDescription>
                      Monitor your server and run commands remotely via our in-browser console terminal
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Pencil className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>Mod Support</CardTitle>
                    </div>
                    <CardDescription>
                      Choose one of our preset minecraft installations, or upload your own custom setups
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Files className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>SFTP</CardTitle>
                    </div>
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
                <p className="text-xl text-muted-foreground">No hidden fees. What you see, is what you get</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => (
                    <Card className={`border ${index === 1 ? 'border-primary shadow-lg scale-105' : ''} relative`} key={index}>
                      {index === 1 && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
                          </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{plan.specification.title}</CardTitle>
                        <div className={`text-4xl font-bold mt-4 ${index === 1 ? 'text-primary' : 'text-primary'}`}>
                          {formatCurrency({type: "EUR", value: plan.price.minor_amounts["EUR"]})}
                        </div>
                        <CardDescription className="text-base">per month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-primary' : 'text-primary'}`} />
                            {plan.specification.ram_gb}GB RAM
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-primary' : 'text-primary'}`} />
                            {plan.specification.ssd_gb}GB SSD storage
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-primary' : 'text-primary'}`} />
                            DDoS protection
                          </li>
                        </ul>
                        <Button className={`w-full mt-6 ${index === 1 ? 'bg-primary hover:bg-primary/90' : ''}`}>
                          Choose {plan.specification.title}
                        </Button>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-muted text-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Minecraft Adventure?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of European players who trust Axolhost with their Minecraft worlds
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignUpButton mode="modal">
                  <Button size="lg" variant="default" className="text-lg px-8 py-6">
                    Start Your Server Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </section>
        </main>
  )
}