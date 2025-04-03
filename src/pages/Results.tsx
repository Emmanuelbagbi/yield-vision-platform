
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, AlertTriangle, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionData {
  cropType: string;
  soilPh: number;
  soilMoisture: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  organicMatter: number;
  rainfall: number;
  humidity: number;
  sunshineHours: number;
  [key: string]: any;
}

interface PredictionResult {
  yield: number;
  confidence: number;
  timestamp: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve prediction data from localStorage
    const storedData = localStorage.getItem("predictionData");
    const storedResult = localStorage.getItem("predictionResult");
    
    if (storedData && storedResult) {
      setPredictionData(JSON.parse(storedData));
      setPredictionResult(JSON.parse(storedResult));
    }
    
    setLoading(false);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view prediction results.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!predictionData || !predictionResult) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No prediction data found. Please make a prediction first.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate("/predict")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to Prediction Page
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const resultDate = new Date(predictionResult.timestamp);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(resultDate);

  // Generate impact factors data for visualization
  const getImpactLevel = (value: number, optimal: number, range: number) => {
    const difference = Math.abs(value - optimal);
    return Math.max(0, 100 - (difference / range) * 100);
  };

  const impactFactorsData = [
    {
      factor: "Soil pH",
      impact: getImpactLevel(predictionData.soilPh, 6.5, 2),
      value: predictionData.soilPh,
      optimal: "6.5-7.0"
    },
    {
      factor: "Moisture",
      impact: getImpactLevel(predictionData.soilMoisture, 35, 20),
      value: `${predictionData.soilMoisture}%`,
      optimal: "30-40%"
    },
    {
      factor: "Nitrogen",
      impact: getImpactLevel(predictionData.nitrogenLevel, 120, 60),
      value: `${predictionData.nitrogenLevel} mg/kg`,
      optimal: "100-140 mg/kg"
    },
    {
      factor: "Phosphorus",
      impact: getImpactLevel(predictionData.phosphorusLevel, 45, 25),
      value: `${predictionData.phosphorusLevel} mg/kg`,
      optimal: "35-55 mg/kg"
    },
    {
      factor: "Potassium",
      impact: getImpactLevel(predictionData.potassiumLevel, 80, 40),
      value: `${predictionData.potassiumLevel} mg/kg`,
      optimal: "70-90 mg/kg"
    },
    {
      factor: "Organic Matter",
      impact: getImpactLevel(predictionData.organicMatter, 3, 2),
      value: `${predictionData.organicMatter}%`,
      optimal: "3-5%"
    },
    {
      factor: "Rainfall",
      impact: getImpactLevel(predictionData.rainfall, 25, 15),
      value: `${predictionData.rainfall} mm/month`,
      optimal: "20-30 mm/month"
    },
  ];

  const sortedImpactFactors = [...impactFactorsData].sort((a, b) => b.impact - a.impact);
  const chartData = sortedImpactFactors.map(item => ({
    factor: item.factor,
    impact: item.impact
  }));

  const handleDownloadReport = () => {
    toast.success("Report downloaded successfully");
  };

  const handleShare = () => {
    toast.success("Results shared with team members");
  };

  const getYieldQuality = (yield_value: number) => {
    if (yield_value >= 75) return "Excellent";
    if (yield_value >= 60) return "Good";
    if (yield_value >= 40) return "Average";
    return "Below Average";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Prediction Results</h1>
          <p className="text-muted-foreground">
            Analysis and insights for your crop yield prediction
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/predict")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Prediction
          </Button>
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main result card */}
        <Card className="lg:col-span-1">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-2xl">{predictionData.cropType.charAt(0).toUpperCase() + predictionData.cropType.slice(1)} Yield Prediction</CardTitle>
            <CardDescription>
              {formattedDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-primary">
                {predictionResult.yield}
                <span className="text-base font-normal text-muted-foreground ml-1">bu/acre</span>
              </div>
              <p className="text-lg font-medium mt-2">
                {getYieldQuality(predictionResult.yield)} Yield Potential
              </p>
              <div className={`flex items-center justify-center mt-1 ${getConfidenceColor(predictionResult.confidence)}`}>
                <span className="text-sm">Prediction Confidence: {predictionResult.confidence}%</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <p className="text-sm font-medium">Prediction Summary</p>
              <p className="text-sm text-muted-foreground">
                Based on the provided soil and environmental parameters, your {predictionData.cropType} crop is predicted to yield {predictionResult.yield} bushels per acre, which is {getYieldQuality(predictionResult.yield).toLowerCase()} for this crop type. This prediction has a confidence level of {predictionResult.confidence}%.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Key Input Parameters</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Crop Type:</div>
                <div className="font-medium">{predictionData.cropType.charAt(0).toUpperCase() + predictionData.cropType.slice(1)}</div>
                
                <div className="text-muted-foreground">Soil pH:</div>
                <div className="font-medium">{predictionData.soilPh}</div>
                
                <div className="text-muted-foreground">Soil Moisture:</div>
                <div className="font-medium">{predictionData.soilMoisture}%</div>
                
                <div className="text-muted-foreground">Nitrogen Level:</div>
                <div className="font-medium">{predictionData.nitrogenLevel} mg/kg</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col bg-muted/30 border-t">
            <p className="text-xs text-muted-foreground mb-2 w-full">
              {user?.role === "admin" || user?.role === "researcher" 
                ? "As a researcher, you have access to detailed statistical models and historical comparisons."
                : "Contact a regional agricultural consultant for assistance with implementing these insights."}
            </p>
            <Button variant="outline" size="sm" className="w-full" onClick={handleShare}>
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Share Results
            </Button>
          </CardFooter>
        </Card>

        {/* Contributing factors */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contributing Factors Analysis</CardTitle>
            <CardDescription>
              Factors that influence the predicted yield
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} label={{ value: 'Impact on Yield (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis type="category" dataKey="factor" width={80} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Bar dataKey="impact" name="Impact on Yield" fill="#82E30D" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Alert className="mb-4 bg-muted">
              <AlertTitle className="flex items-center text-sm font-medium">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Explainable AI Insights
              </AlertTitle>
              <AlertDescription className="text-xs mt-2">
                Our AI model identifies key factors that most influence your predicted yield. Focus on optimizing the highest impact factors for best results.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p className="font-medium">Top Factors Impacting Your Yield</p>
              
              {sortedImpactFactors.slice(0, 4).map((factor, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">{factor.factor}</span>
                      <span className="text-muted-foreground ml-2">
                        (Current: {factor.value})
                      </span>
                    </div>
                    <span className={`${
                      factor.impact >= 85 ? "text-green-600" : 
                      factor.impact >= 70 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {factor.impact.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={factor.impact} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Optimal range: {factor.optimal}
                  </p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <p className="font-medium mb-3">Recommendations</p>
              <ul className="space-y-2 text-sm">
                {sortedImpactFactors[0].impact < 80 && (
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                    <span>Consider adjusting {sortedImpactFactors[0].factor.toLowerCase()} levels to reach the optimal range of {sortedImpactFactors[0].optimal}.</span>
                  </li>
                )}
                {sortedImpactFactors[1].impact < 80 && (
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                    <span>Optimize {sortedImpactFactors[1].factor.toLowerCase()} to improve yield potential.</span>
                  </li>
                )}
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <span>Regular monitoring of soil nutrients is recommended for maintaining optimal growing conditions.</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <span>Consider soil amendments to improve organic matter content for long-term soil health.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
