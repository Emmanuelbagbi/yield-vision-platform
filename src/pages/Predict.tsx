
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, AlertCircle, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  cropType: z.string().min(1, { message: "Please select a crop type" }),
  soilPh: z.coerce.number().min(0, { message: "pH must be positive" }).max(14, { message: "pH must be between 0 and 14" }),
  soilMoisture: z.coerce.number().min(0, { message: "Moisture must be positive" }).max(100, { message: "Moisture must be between 0 and 100" }),
  soilTemperature: z.coerce.number(),
  nitrogenLevel: z.coerce.number().min(0, { message: "Nitrogen level must be positive" }),
  phosphorusLevel: z.coerce.number().min(0, { message: "Phosphorus level must be positive" }),
  potassiumLevel: z.coerce.number().min(0, { message: "Potassium level must be positive" }),
  organicMatter: z.coerce.number().min(0, { message: "Organic matter must be positive" }).max(100, { message: "Organic matter must be between 0 and 100" }),
  rainfall: z.coerce.number().min(0, { message: "Rainfall must be positive" }),
  humidity: z.coerce.number().min(0, { message: "Humidity must be positive" }).max(100, { message: "Humidity must be between 0 and 100" }),
  sunshineHours: z.coerce.number().min(0, { message: "Sunshine hours must be positive" }).max(24, { message: "Sunshine hours must be between 0 and 24" }),
});

type FormValues = z.infer<typeof formSchema>;

const Predict = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default values
  const defaultValues: FormValues = {
    cropType: "wheat",
    soilPh: 6.5,
    soilMoisture: 35,
    soilTemperature: 22,
    nitrogenLevel: 120,
    phosphorusLevel: 45,
    potassiumLevel: 80,
    organicMatter: 3,
    rainfall: 25,
    humidity: 65,
    sunshineHours: 6,
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, we would send the data to an API
      console.log("Submitting prediction data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store prediction data in localStorage for the Results page
      localStorage.setItem("predictionData", JSON.stringify(data));
      localStorage.setItem("predictionResult", JSON.stringify({
        yield: Math.floor(Math.random() * 50) + 30, // Random yield between 30-80
        confidence: Math.floor(Math.random() * 15) + 85, // Random confidence between 85-100%
        timestamp: new Date().toISOString(),
      }));
      
      toast.success("Prediction successful!");
      navigate("/results");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("There was an error processing your prediction.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to make crop yield predictions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-6">
        <div className="lg:col-span-4">
          <h1 className="text-3xl font-bold mb-2">Predict Crop Yield</h1>
          <p className="text-muted-foreground mb-6">
            Enter soil and environmental parameters to predict crop yield
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Yield Prediction Form</CardTitle>
              <CardDescription>
                Fill in the form with your field's soil and environmental data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select crop type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="soybean">Soybean</SelectItem>
                            <SelectItem value="potato">Potato</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  <h3 className="text-lg font-medium">Soil Parameters</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="soilPh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil pH</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0" max="14" {...field} />
                          </FormControl>
                          <FormDescription>Range: 0-14 (7 is neutral)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="soilMoisture"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Soil Moisture (%)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                defaultValue={[value]}
                                max={100}
                                step={1}
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Dry</span>
                                <span className="text-sm font-medium">{value}%</span>
                                <span className="text-sm text-muted-foreground">Wet</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="soilTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organicMatter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organic Matter (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0" max="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <h4 className="text-md font-medium">Nutrient Levels (mg/kg)</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="nitrogenLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nitrogen</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phosphorusLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phosphorus</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="potassiumLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Potassium</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  <h3 className="text-lg font-medium">Environmental Parameters</h3>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="rainfall"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rainfall (mm/month)</FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="humidity"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Humidity (%)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                defaultValue={[value]}
                                max={100}
                                step={1}
                                onValueChange={(vals) => onChange(vals[0])}
                              />
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Low</span>
                                <span className="text-sm font-medium">{value}%</span>
                                <span className="text-sm text-muted-foreground">High</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sunshineHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sunshine (hours/day)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" min="0" max="24" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Get Prediction"}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Alert className="mb-6 bg-muted">
              <AlertTitle className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Tips for Accurate Predictions
              </AlertTitle>
              <AlertDescription className="mt-4">
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Use recent soil test results for accurate nutrient values</li>
                  <li>Enter the average rainfall for your growing season</li>
                  <li>Soil moisture should reflect current field conditions</li>
                  <li>Consider seasonal averages for environmental data</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Sample Values</CardTitle>
                <CardDescription>
                  Optimal values for different crop types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Wheat</h4>
                    <ul className="text-sm space-y-1">
                      <li>pH: 6.0-7.0</li>
                      <li>Nitrogen: 100-140 mg/kg</li>
                      <li>Moisture: 30-40%</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Corn</h4>
                    <ul className="text-sm space-y-1">
                      <li>pH: 5.8-7.0</li>
                      <li>Nitrogen: 140-200 mg/kg</li>
                      <li>Moisture: 35-45%</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Soybean</h4>
                    <ul className="text-sm space-y-1">
                      <li>pH: 6.0-7.0</li>
                      <li>Potassium: 80-120 mg/kg</li>
                      <li>Organic Matter: >3%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <p className="text-xs text-muted-foreground">
                  Values may vary by region, soil type, and climate conditions.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
