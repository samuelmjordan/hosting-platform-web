import Image from "next/image";

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
  Pencil,
  Files
} from "lucide-react"
import {fetchPlans} from "@/app/_services/public/planService";
import {formatCurrency} from "@/app/_components/page/billing/utils/formatters";
import {STORE_PATH} from "@/app/constants";
import React from "react";

export default async function Home() {
  const { userId } = await auth()
  const plans = await fetchPlans('GAME_SERVER');
  if (userId) {
    redirect(STORE_PATH)
  }

  return (
      <main className="flex-1 bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-muted/50 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 backdrop-blur-sm shadow-lg animate-pulse">
              🇪🇺 European Data Centers • GDPR Compliant
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 text-foreground drop-shadow-2xl">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
                  Axolhost
                </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-4 max-w-3xl mx-auto font-medium">
              Premium Minecraft Java Edition server hosting designed for European players
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Lightning-fast servers, instant setup, and straightforward management. Get your Minecraft world online in
              under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-2xl hover:shadow-accent/25 transform hover:scale-105 transition-all duration-300 font-bold">
                  Start Your Server
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm">
                <CheckCircle className="w-4 h-4 text-accent mr-2" />
                No Hidden Fees
              </div>
              <div className="flex items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm">
                <CheckCircle className="w-4 h-4 text-accent mr-2" />
                No Player Limits
              </div>
              <div className="flex items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm">
                <CheckCircle className="w-4 h-4 text-accent mr-2" />
                DDoS Protection
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-br from-muted/50 via-background/30 to-muted/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose Axolhost?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built specifically for Minecraft Java Edition with European players in mind
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border bg-card/70 backdrop-blur-sm hover:bg-card/90 hover:border-accent/50 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-accent/30">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">European Data Centers</CardTitle>
                  </div>
                  <CardDescription>
                    Servers located in Germany for low latency anywhere in Europe
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border bg-card/70 backdrop-blur-sm hover:bg-card/90 hover:border-accent/50 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-accent/30">
                      <Zap className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">Instant Setup</CardTitle>
                  </div>
                  <CardDescription>
                    Your Minecraft server is ready in under 2 minutes with our one-click deployment
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border bg-card/70 backdrop-blur-sm hover:bg-card/90 hover:border-accent/50 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-accent/30">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">DDoS Protection</CardTitle>
                  </div>
                  <CardDescription>
                    Enterprise-grade DDoS protection keeps your server online even during attacks
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border bg-card/70 backdrop-blur-sm hover:bg-card/90 hover:border-accent/50 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-accent/30">
                      <Terminal className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">Server Console</CardTitle>
                  </div>
                  <CardDescription>
                    Monitor your server and run commands remotely via our in-browser console terminal
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border bg-card/70 backdrop-blur-sm hover:bg-card/90 hover:border-accent/50 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-accent/30">
                      <Pencil className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">Mod Support</CardTitle>
                  </div>
                  <CardDescription>
                    Choose one of our preset minecraft installations, or upload your own custom setups
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border bg-card/70 backdrop-blur-sm hover:bg-card/90 hover:border-accent/50 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-accent/30">
                      <Files className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">SFTP</CardTitle>
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
        <section id="pricing" className="py-20 bg-gradient-to-br from-background via-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground">No hidden fees. What you see, is what you get</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                  <Card className={`
                      border bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 shadow-lg hover:shadow-xl
                      ${index === 1 ? 'border-accent shadow-2xl shadow-accent/20 scale-105 hover:scale-110' : 'hover:scale-105'} 
                      relative group
                    `} key={index}>
                    {index === 1 && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              Most Popular
                            </span>
                        </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          <Image
                              src={`/${plan.specification.title}.webp`}
                              alt={plan.specification.title}
                              fill
                              className="object-cover pixelated"
                          />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">{plan.specification.title}</CardTitle>
                      </div>
                      <div className={`text-5xl font-bold mb-2 text-foreground`}>
                        {formatCurrency({type: "EUR", value: plan.price.minor_amounts["EUR"]})}
                      </div>
                      <CardDescription className="font-medium">per month</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-foreground/80">
                          <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-accent' : 'text-green-500'}`} />
                          <span className="font-medium">{plan.specification.ram_gb}GB RAM</span>
                        </li>
                        <li className="flex items-center text-foreground/80">
                          <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-accent' : 'text-green-500'}`} />
                          <span className="font-medium">{plan.specification.ssd_gb}GB SSD storage</span>
                        </li>
                        <li className="flex items-center text-foreground/80">
                          <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-accent' : 'text-green-500'}`} />
                          <span className="font-medium">DDoS protection</span>
                        </li>
                      </ul>
                      <Button className={`
                          w-full font-semibold transition-all duration-300 
                          ${index === 1
                          ? 'bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-lg hover:shadow-xl'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border hover:border-accent/50'
                      }
                        `}>
                        Choose {plan.specification.title}
                      </Button>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-muted/50 via-background/70 to-muted/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Start Your Minecraft Adventure?</h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join hundreds of European players who trust Axolhost with their Minecraft worlds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-2xl hover:shadow-accent/25 transform hover:scale-105 transition-all duration-300 font-bold">
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