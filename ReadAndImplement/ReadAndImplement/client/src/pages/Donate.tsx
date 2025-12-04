import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, Home, Baby, Utensils } from "lucide-react";

export default function Donate() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-heading font-bold mb-4">Support the Relief Effort</h1>
        <p className="text-muted-foreground">
          Directly fund specific needs. All donations are tracked and transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DonationCard 
            title="Dry Rations Pack" 
            amount="LKR 5,000" 
            icon={<Utensils className="h-6 w-6"/>}
            desc="Provides a family of 4 with food for one week."
        />
        <DonationCard 
            title="Medical Kit" 
            amount="LKR 2,500" 
            icon={<Heart className="h-6 w-6"/>}
            desc="Essential first aid and medicines for injured persons."
            highlight
        />
        <DonationCard 
            title="Shelter Materials" 
            amount="LKR 15,000" 
            icon={<Home className="h-6 w-6"/>}
            desc="Tarpaulins, ropes, and mats for temporary shelter."
        />
      </div>

      <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Corporate & Large Scale Donations</h2>
                  <p className="text-muted-foreground mb-6">
                      For bulk donations of goods, logistics support, or CSR initiatives, please contact our central coordination unit directly.
                  </p>
                  <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border">
                          <div className="font-bold">Coordinating Officer</div>
                          <div>+94 11 234 5678</div>
                      </div>
                      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border">
                          <div className="font-bold">Email</div>
                          <div>donations@reliefbridge.lk</div>
                      </div>
                  </div>
              </div>
              <div className="space-y-6">
                  <h3 className="font-semibold">Current Urgent Requirements</h3>
                  <ul className="space-y-3">
                      <RequirementItem item="Drinking Water (5L Bottles)" urgency="Critical" />
                      <RequirementItem item="Baby Formula & Diapers" urgency="High" />
                      <RequirementItem item="Sanitary Pads" urgency="High" />
                      <RequirementItem item="Generators" urgency="Moderate" />
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
}

function DonationCard({ title, amount, icon, desc, highlight }: { title: string, amount: string, icon: React.ReactNode, desc: string, highlight?: boolean }) {
    return (
        <Card className={`flex flex-col ${highlight ? 'border-primary ring-1 ring-primary shadow-lg' : ''}`}>
            <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {icon}
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="text-2xl font-bold text-primary">{amount}</div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant={highlight ? 'default' : 'outline'}>Donate Now</Button>
            </CardFooter>
        </Card>
    );
}

function RequirementItem({ item, urgency }: { item: string, urgency: string }) {
    return (
        <div className="flex items-center justify-between bg-background p-3 rounded border">
            <span>{item}</span>
            <Badge variant={urgency === 'Critical' ? 'destructive' : 'secondary'}>{urgency}</Badge>
        </div>
    )
}
