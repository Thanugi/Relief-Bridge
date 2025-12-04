import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApp } from "@/lib/AppContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { HeartHandshake, Truck, Search, BriefcaseMedical, Hammer, User, Building2, Phone, MapPin, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const volunteerSchema = z.object({
  name: z.string().min(2),
  contact: z.string().min(9),
  skills: z.array(z.string()).min(1),
  location: z.string().min(2),
});

export default function Volunteer() {
  const { volunteers, deleteVolunteer } = useApp();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-heading font-bold mb-4">Volunteer Registry</h1>
        <p className="text-muted-foreground">
          Join the effort or find volunteers near you. All information is transparently shared to facilitate direct coordination.
        </p>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="register">Register as Volunteer</TabsTrigger>
            <TabsTrigger value="directory">Volunteer Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Needed Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SkillItem icon={<Truck className="w-4 h-4"/>} title="Transport & Logistics" desc="4x4 vehicles, trucks, boats" />
                            <SkillItem icon={<BriefcaseMedical className="w-4 h-4"/>} title="Medical" desc="Doctors, nurses, paramedics" />
                            <SkillItem icon={<Search className="w-4 h-4"/>} title="Search & Rescue" desc="Swimming, climbing, first aid" />
                            <SkillItem icon={<Hammer className="w-4 h-4"/>} title="General Labor" desc="Cleaning, packing, cooking" />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="individual">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="individual">Individual Volunteer</TabsTrigger>
                            <TabsTrigger value="entity">Organization / Group</TabsTrigger>
                        </TabsList>
                        <TabsContent value="individual">
                            <VolunteerForm type="individual" />
                        </TabsContent>
                        <TabsContent value="entity">
                            <VolunteerForm type="entity" />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="directory">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No volunteers registered yet. Be the first!
                    </div>
                ) : (
                    volunteers.map((v) => (
                        <Card key={v.id} className="overflow-hidden group relative">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={() => deleteVolunteer(v.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="bg-primary/5 p-4 border-b flex justify-between items-start">
                                <div className="flex gap-3 items-center">
                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border shadow-sm text-primary">
                                        {v.type === 'individual' ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold pr-8">{v.name}</div>
                                        <div className="text-xs text-muted-foreground capitalize">{v.type}</div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <span>{v.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <a href={`tel:${v.contact}`} className="text-primary hover:underline font-medium">{v.contact}</a>
                                </div>
                                <div className="pt-2 flex flex-wrap gap-1">
                                    {v.skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="text-xs font-normal">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VolunteerForm({ type }: { type: "individual" | "entity" }) {
    const { addVolunteer } = useApp();
    const form = useForm<z.infer<typeof volunteerSchema>>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            name: "",
            contact: "",
            location: "",
            skills: [],
        }
    });

    function onSubmit(values: z.infer<typeof volunteerSchema>) {
        addVolunteer({
            ...values,
            type
        });
        form.reset();
    }

    const skillsList = [
        "Medical Aid", "Transport (Vehicle)", "Transport (Boat)", 
        "Cooking / Food Prep", "Search & Rescue", "Manual Labor", 
        "Coordination / Admin", "Psychological Support"
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{type === 'individual' ? 'Volunteer Registration' : 'Register Organization'}</CardTitle>
                <CardDescription>
                    Join the database of verified volunteers. We will contact you based on proximity and needs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{type === 'individual' ? 'Full Name' : 'Organization Name'}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Location</FormLabel>
                                        <FormControl><Input placeholder="e.g. Colombo 03" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        <FormField
                            control={form.control}
                            name="skills"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Available Skills / Resources</FormLabel>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {skillsList.map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="skills"
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={item}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {item}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">Register</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function SkillItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center rounded">
                {icon}
            </div>
            <div>
                <div className="font-medium text-sm">{title}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
        </div>
    );
}
