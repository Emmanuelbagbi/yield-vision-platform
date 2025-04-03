
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formSchema = z.object({
  cropType: z.string().min(1, "Please select a crop type"),
  soilPh: z.coerce.number().min(3, "pH must be at least 3").max(10, "pH must not exceed 10"),
  soilMoisture: z.coerce.number().min(0, "Moisture must be at least 0%").max(100, "Moisture must not exceed 100%"),
  soilTemperature: z.coerce.number().min(0, "Temperature must be at least 0°C").max(50, "Temperature must not exceed 50°C"),
  nitrogenLevel: z.coerce.number().min(0, "Nitrogen must be at least 0 mg/kg").max(200, "Nitrogen must not exceed 200 mg/kg"),
  phosphorusLevel: z.coerce.number().min(0, "Phosphorus must be at least 0 mg/kg").max(100, "Phosphorus must not exceed 100 mg/kg"),
  potassiumLevel: z.coerce.number().min(0, "Potassium must be at least 0 mg/kg").max(200, "Potassium must not exceed 200 mg/kg"),
  organicMatter: z.coerce.number().min(0, "Organic matter must be at least 0%").max(10, "Organic matter must not exceed 10%"),
  rainfall: z.coerce.number().min(0, "Rainfall must be at least 0 mm/month").max(100, "Rainfall must not exceed 100 mm/month"),
  humidity: z.coerce.number().min(0, "Humidity must be at least 0%").max(100, "Humidity must not exceed 100%"),
  sunshineHours: z.coerce.number().min(0, "Sunshine hours must be at least 0").max(12, "Sunshine hours must not exceed 12"),
});

type FormValues = z.infer<typeof formSchema>;

const cropOptions = [
  { value: "wheat", label: "Wheat" },
  { value: "corn", label: "Corn" },
  { value: "rice", label: "Rice" },
  { value: "soybean", label: "Soybean" },
  { value: "barley", label: "Barley" },
];

// Default form values
const defaultValues: FormValues = {
  cropType: "wheat",
  soilPh: 6.5,
  soilMoisture: 35,
  soilTemperature: 21.9,
  nitrogenLevel: 120,
  phosphorusLevel: 45,
  potassiumLevel: 80,
  organicMatter: 3,
  rainfall: 25,
  humidity: 65,
  sunshineHours: 6,
};

const Predict = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Monitor current values for sliders
  const soilPh = form.watch("soilPh");
  const soilMoisture = form.watch("soilMoisture");
  const nitrogenLevel = form.watch("nitrogenLevel");
  const phosphorusLevel = form.watch("phosphorusLevel");
  const potassiumLevel = form.watch("potassiumLevel");
  const organicMatter = form.watch("organicMatter");
  const rainfall = form.watch("rainfall");
  const humidity = form.watch("humidity");
  const sunshineHours = form.watch("sunshineHours");

  const onSubmit = async (data: FormValues) => {
    console.info("Submitting prediction data:", data);
    
    // Only allow authenticated users to submit
    if (!isAuthenticated) {
      toast.error("Please log in to submit prediction data");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call with a 1.5 second delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock prediction result
      const predictionResult = {
        yield: Math.floor(60 + Math.random() * 25), // Random yield between 60-85
        confidence: Math.floor(85 + Math.random() * 10), // Random confidence between 85-95%
        timestamp: new Date().toISOString()
      };
      
      // Store prediction data and result in localStorage
      localStorage.setItem("predictionData", JSON.stringify(data));
      localStorage.setItem("predictionResult", JSON.stringify(predictionResult));
      
      toast.success("Prediction completed successfully");
      
      // Navigate to results page
      navigate("/results");
    } catch (error) {
      console.error("Error during prediction:", error);
      toast.error("Failed to process prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset(defaultValues);
    toast("Form reset to default values");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Crop Yield Prediction</h1>
      <p className="text-muted-foreground mb-6">
        Enter soil and environmental parameters to predict crop yield
      </p>

      {!isAuthenticated && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to submit prediction data and view results.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Parameters</CardTitle>
              <CardDescription>
                Enter the soil and environmental parameters for your field
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cropType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select crop type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cropOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the type of crop you're growing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="soilPh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil pH (3-10)</FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">3.0</span>
                                <span className="text-sm font-medium">{field.value.toFixed(1)}</span>
                                <span className="text-sm">10.0</span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={3}
                                  max={10}
                                  step={0.1}
                                  value={[field.value]}
                                  onValueChange={([value]) => field.onChange(value)}
                                />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Optimal pH range for most crops: 6.0-7.5
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="soilMoisture"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil Moisture (%)</FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">0%</span>
                                <span className="text-sm font-medium">{field.value}%</span>
                                <span className="text-sm">100%</span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={([value]) => field.onChange(value)}
                                />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Optimal moisture range: 30-40%
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="nitrogenLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nitrogen (mg/kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Optimal: 100-140 mg/kg
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phosphorusLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phosphorus (mg/kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Optimal: 35-55 mg/kg
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="potassiumLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Potassium (mg/kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Optimal: 70-90 mg/kg
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="organicMatter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organic Matter (%)</FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">0%</span>
                                <span className="text-sm font-medium">{field.value}%</span>
                                <span className="text-sm">10%</span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={10}
                                  step={0.1}
                                  value={[field.value]}
                                  onValueChange={([value]) => field.onChange(value)}
                                />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Optimal range: 3-5%
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rainfall"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rainfall (mm/month)</FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">0mm</span>
                                <span className="text-sm font-medium">{field.value}mm</span>
                                <span className="text-sm">100mm</span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={([value]) => field.onChange(value)}
                                />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Optimal range: 20-30 mm/month
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="humidity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Humidity (%)</FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">0%</span>
                                <span className="text-sm font-medium">{field.value}%</span>
                                <span className="text-sm">100%</span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={([value]) => field.onChange(value)}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sunshineHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sunshine Hours (per day)</FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">0h</span>
                                <span className="text-sm font-medium">{field.value}h</span>
                                <span className="text-sm">12h</span>
                              </div>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={12}
                                  step={0.5}
                                  value={[field.value]}
                                  onValueChange={([value]) => field.onChange(value)}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="soilTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Optimal range: 18-24°C
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Reset to Defaults
                    </Button>
                    <Button type="submit" disabled={isLoading || !isAuthenticated}>
                      {isLoading ? "Processing..." : "Generate Prediction"}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm">
                  <p>
                    Our prediction system uses machine learning models trained on historical data to estimate crop yields based on various environmental and soil parameters.
                  </p>
                  <p>
                    The more accurate your input data, the more precise our predictions will be.
                  </p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Enter your soil and environmental parameters</li>
                    <li>Submit the form to generate a prediction</li>
                    <li>Review the detailed results and recommendations</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimal Conditions</CardTitle>
                <CardDescription>
                  Reference values for {form.watch("cropType")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soil pH:</span>
                    <span>6.5-7.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nitrogen:</span>
                    <span>100-140 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phosphorus:</span>
                    <span>35-55 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Potassium:</span>
                    <span>70-90 mg/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soil Temperature:</span>
                    <span>18-24°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
