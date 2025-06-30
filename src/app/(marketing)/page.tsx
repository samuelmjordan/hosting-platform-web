export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  Server,
  Zap,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Gamepad2,
  Database,
  Headphones,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect("/store")
  }

  return (
      <main className="flex-1">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-800">AxolHost</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-green-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">
                Pricing
              </Link>
              <Link href="#support" className="text-gray-600 hover:text-green-600 transition-colors">
                Support
              </Link>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
              🇪🇺 European Data Centers • GDPR Compliant
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AxolHost
            </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Premium Minecraft Java Edition server hosting designed for European players
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Lightning-fast servers, instant setup, and straightforward management. Get your Minecraft world online in
              under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                  Start Your Server
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignUpButton>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                View Live Demo
                <Gamepad2 className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No Setup Fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                24/7 Support
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                99.9% Uptime
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose AxolHost?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built specifically for Minecraft Java Edition with European players in mind
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>European Data Centers</CardTitle>
                  <CardDescription>
                    Servers located in Amsterdam, Frankfurt, and London for optimal latency across Europe
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Instant Setup</CardTitle>
                  <CardDescription>
                    Your Minecraft server is ready in under 60 seconds with our one-click deployment
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>DDoS Protection</CardTitle>
                  <CardDescription>
                    Enterprise-grade DDoS protection keeps your server online even during attacks
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Automatic Backups</CardTitle>
                  <CardDescription>
                    Daily automated backups with one-click restore. Your world is always safe
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Gamepad2 className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Mod Support</CardTitle>
                  <CardDescription>
                    Full support for Forge, Fabric, Paper, Spigot, and all popular modpacks
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>24/7 Expert Support</CardTitle>
                  <CardDescription>
                    Real Minecraft experts available around the clock via Discord and tickets
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">No hidden fees. Cancel anytime. European VAT included.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <div className="text-4xl font-bold text-green-600 mt-4">€4.99</div>
                  <CardDescription className="text-base">per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      2GB RAM
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Up to 10 players
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      10GB SSD storage
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Daily backups
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Choose Starter</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500 relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">Most Popular</Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <div className="text-4xl font-bold text-green-600 mt-4">€9.99</div>
                  <CardDescription className="text-base">per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      4GB RAM
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Up to 25 players
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      25GB SSD storage
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Choose Pro</Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <div className="text-4xl font-bold text-green-600 mt-4">€19.99</div>
                  <CardDescription className="text-base">per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      8GB RAM
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Up to 50 players
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      50GB SSD storage
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Dedicated support
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Choose Enterprise</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Trusted by European Minecraft Communities</h2>
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xl font-semibold">4.9/5</span>
                <span className="text-gray-600">(2,847 reviews)</span>
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
                  <p className="text-gray-600 mb-4">
                    "Switched from another host and the difference is night and day. Server runs perfectly with 30+
                    players online."
                  </p>
                  <div className="font-semibold">- Minecrafter_EU</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Support team helped me set up my modpack in minutes. These guys know Minecraft inside and out."
                  </p>
                  <div className="font-semibold">- BlockBuilder_DE</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Best hosting in Europe. Low latency, great uptime, and the control panel is so easy to use."
                  </p>
                  <div className="font-semibold">- CraftMaster_NL</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
              <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                Talk to Sales
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">30-day money-back guarantee • No setup fees • Cancel anytime</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold">AxolHost</span>
                </div>
                <p className="text-gray-400">Premium Minecraft server hosting for European players.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Server Locations
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Discord
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      GDPR
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 AxolHost. All rights reserved. Made with ❤️ for European Minecraft players.</p>
            </div>
          </div>
        </footer>
      </main>
  )
}
