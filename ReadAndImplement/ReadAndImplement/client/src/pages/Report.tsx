import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApp } from "@/lib/AppContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Loader2, MapPin, Upload, FileCheck } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  contact: z.string().min(9, {
    message: "Please provide a valid contact number.",
  }),
  severity: z.enum(["Critical", "Very High", "High", "Moderate", "Low"]),
  description: z.string().min(10, {
    message: "Please describe the situation.",
  }),
  needs: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Select at least one need.",
  }),
});

export default function Report() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-heading font-bold">Report a Case</h1>
        <p className="text-muted-foreground">
          Please provide accurate details to help rescue teams reach you faster.
        </p>
      </div>

      <Tabs defaultValue="self" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="self">I need help (Self)</TabsTrigger>
          <TabsTrigger value="relative">Reporting for someone else</TabsTrigger>
        </TabsList>
        
        <TabsContent value="self">
          <ReportForm type="self" />
        </TabsContent>
        
        <TabsContent value="relative">
          <ReportForm type="relative" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportForm({ type }: { type: "self" | "relative" }) {
  const { addReport } = useApp();
  const [fileName, setFileName] = useState<string | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
      severity: "High",
      description: "",
      needs: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate network delay
    const fakeSubmit = async () => {
       await new Promise(resolve => setTimeout(resolve, 1000));
       addReport({
         ...values,
         type,
         severity: values.severity as any,
         evidence: evidenceFile || undefined,
       });
       form.reset();
       setFileName(null);
       setEvidenceFile(null);
    };
    fakeSubmit();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setFileName(file.name);
          const url = URL.createObjectURL(file);
          setEvidenceFile(url);
      }
  };

  const needsOptions = [
    { id: "Food", label: "Food & Water" },
    { id: "Medical", label: "Medical Assistance" },
    { id: "Shelter", label: "Shelter / Evacuation" },
    { id: "Clothing", label: "Clothing" },
    { id: "Electricity", label: "Power / Charging" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === 'self' ? 'My Details' : 'Victim Details'}</CardTitle>
        <CardDescription>
          {type === 'self' 
            ? 'Your information will be shared with verified relief teams.'
            : 'Please provide the last known location of the person you are reporting for.'
          }
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="07X XXXXXXX" {...field} />
                    </FormControl>
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
                  <FormLabel>Location</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="City, Street, or Landmark" className="pl-10" {...field} />
                    </FormControl>
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Be as specific as possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situation Severity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Critical">Critical (Life Threatening)</SelectItem>
                      <SelectItem value="Very High">Very High (Urgent Evacuation)</SelectItem>
                      <SelectItem value="High">High (Trapped / Injured)</SelectItem>
                      <SelectItem value="Moderate">Moderate (Displaced)</SelectItem>
                      <SelectItem value="Low">Low (Need Supplies)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="needs"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Immediate Needs</FormLabel>
                    <FormDescription>
                      Select all that apply.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {needsOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="needs"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the situation, number of people, special medical needs, etc."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
                <Label>Evidence (Optional)</Label>
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full border-dashed border-2 h-20 text-muted-foreground flex flex-col gap-2"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {fileName ? (
                        <>
                            <FileCheck className="h-6 w-6 text-green-600" />
                            <span className="text-foreground font-medium">{fileName}</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-6 w-6" />
                            <span>Click to Upload Photos</span>
                        </>
                    )}
                </Button>
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
