import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, HandHeart, Users, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/simple_minimal_line_art_of_helping_hands_in_teal.png";

export default function Home() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/20 pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Disaster Relief Activation
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Coordinating Help <br/>
                <span className="text-primary">Where It's Needed Most</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                ReliefBridge is a community-driven platform connecting those affected by the recent disaster with volunteers, donors, and rescue teams in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/report">
                  <Button size="lg" className="h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    I Need Help
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background hover:bg-muted/50">
                    <HandHeart className="mr-2 h-5 w-5" />
                    I Want to Help
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:h-[500px] w-full flex items-center justify-center">
               <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-white/50 backdrop-blur-sm p-8">
                  <img 
                    src={heroImage} 
                    alt="Relief Coordination Illustration" 
                    className="rounded-xl w-full h-auto object-cover max-h-[500px]"
                  />
               </div>
               {/* Decorative elements */}
               <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">How ReliefBridge Works</h2>
            <p className="text-muted-foreground">
              A transparent, open platform designed to speed up recovery efforts through community collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<AlertTriangle className="h-8 w-8 text-primary" />}
              title="Report Incidents"
              description="Affected individuals or relatives can report needs, ensuring rescue teams know exactly where to go."
              link="/report"
            />
            <FeatureCard 
              icon={<Activity className="h-8 w-8 text-primary" />}
              title="Dashboard"
              description="View reported incidents and needs in a centralized dashboard to understand the situation better."
              link="/dashboard"
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Find Support"
              description="Connect directly with verified volunteers and long-term support donors in the public pool."
              link="/support"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <ShieldCheck className="h-16 w-16 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold">Join the Relief Effort</h2>
              <p className="text-primary-foreground/80 text-lg">
                Your contribution, no matter how small, makes a difference. Join our network of volunteers and donors today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/volunteer">
                  <Button size="lg" variant="secondary" className="h-12 px-8">
                    Register as Volunteer
                  </Button>
                </Link>
                <Link href="/support">
                  <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/10 text-white">
                    Offer Support
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute left-0 bottom-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <Link href={link}>
      <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-border/60 group">
        <CardContent className="p-8 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <h3 className="text-xl font-bold font-heading">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex items-center text-primary font-medium pt-2">
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
