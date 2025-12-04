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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Trash2 } from "lucide-react";

const supportSchema = z.object({
  name: z.string().min(2),
  contact: z.string().min(9),
  location: z.string().min(2),
  category: z.enum(['Housing', 'Medical', 'Education', 'Livelihood', 'Other']),
  description: z.string().min(10),
});

export default function LongTermSupport() {
  const { longTermSupports, deleteLongTermSupport } = useApp();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-heading font-bold mb-4">Long Term Support</h1>
        <p className="text-muted-foreground">
          Connecting donors with families needing long-term assistance for housing, medical bills, and rehabilitation.
        </p>
      </div>

      <Tabs defaultValue="pool" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="pool">Support Pool</TabsTrigger>
          <TabsTrigger value="offer">Offer / Request Support</TabsTrigger>
        </TabsList>

        <TabsContent value="pool">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {longTermSupports.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No entries yet.
                    </div>
                ) : (
                    longTermSupports.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-l-4 border-l-primary group relative">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={() => deleteLongTermSupport(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between items-start pr-8">
                                    <div>
                                        <Badge variant={item.type === 'offer' ? 'default' : 'secondary'} className="mb-2">
                                            {item.type === 'offer' ? 'Offering Support' : 'Requesting Help'}
                                        </Badge>
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                    </div>
                                    <Badge variant="outline">{item.category}</Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                                    {item.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a href={`tel:${item.contact}`} className="text-primary font-medium hover:underline">
                                            {item.contact}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </TabsContent>

        <TabsContent value="offer">
            <div className="max-w-2xl mx-auto">
                <Tabs defaultValue="offer_form" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="offer_form">I Want to Help</TabsTrigger>
                        <TabsTrigger value="request_form">I Need Help</TabsTrigger>
                    </TabsList>
                    <TabsContent value="offer_form">
                        <SupportForm type="offer" />
                    </TabsContent>
                    <TabsContent value="request_form">
                        <SupportForm type="request" />
                    </TabsContent>
                </Tabs>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SupportForm({ type }: { type: 'offer' | 'request' }) {
    const { addLongTermSupport } = useApp();
    const form = useForm<z.infer<typeof supportSchema>>({
        resolver: zodResolver(supportSchema),
        defaultValues: {
            name: "",
            contact: "",
            location: "",
            description: "",
            category: "Housing"
        }
    });

    function onSubmit(values: z.infer<typeof supportSchema>) {
        addLongTermSupport({
            ...values,
            type,
            category: values.category as any
        });
        form.reset();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{type === 'offer' ? 'Offer Long Term Support' : 'Request Long Term Support'}</CardTitle>
                <CardDescription>
                    {type === 'offer' 
                        ? 'Your offer will be visible to those in need. They will contact you directly.' 
                        : 'Describe your long-term needs (e.g., house rebuilding, medical funding).'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name / Organization</FormLabel>
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
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Housing">Housing / Rebuilding</SelectItem>
                                            <SelectItem value="Medical">Medical Bills / Treatment</SelectItem>
                                            <SelectItem value="Education">Education Support</SelectItem>
                                            <SelectItem value="Livelihood">Livelihood Restoration</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location / Area</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Details</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder={type === 'offer' ? "Describe what you can provide..." : "Describe your situation and needs..."}
                                            className="min-h-[100px]"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
