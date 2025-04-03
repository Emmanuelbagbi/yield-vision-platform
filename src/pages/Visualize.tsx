
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, Tooltip, Legend, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from "recharts";

// Sample data for charts
const monthlyYieldData = [
  { month: "Jan", wheat: 65, corn: 40, rice: 35 },
  { month: "Feb", wheat: 68, corn: 45, rice: 37 },
  { month: "Mar", wheat: 62, corn: 48, rice: 39 },
  { month: "Apr", wheat: 70, corn: 52, rice: 43 },
  { month: "May", wheat: 72, corn: 58, rice: 44 },
  { month: "Jun", wheat: 68, corn: 62, rice: 48 },
  { month: "Jul", wheat: 65, corn: 68, rice: 52 },
  { month: "Aug", wheat: 63, corn: 72, rice: 54 },
  { month: "Sep", wheat: 60, corn: 68, rice: 49 },
  { month: "Oct", wheat: 58, corn: 62, rice: 45 },
  { month: "Nov", wheat: 60, corn: 55, rice: 42 },
  { month: "Dec", wheat: 62, corn: 48, rice: 38 },
];

const environmentalImpactData = [
  { factor: "Soil pH", optimal: 85, low: 45, high: 55 },
  { factor: "Moisture", optimal: 80, low: 40, high: 60 },
  { factor: "Temperature", optimal: 75, low: 38, high: 52 },
  { factor: "Nitrogen", optimal: 90, low: 42, high: 58 },
  { factor: "Phosphorus", optimal: 85, low: 48, high: 55 },
  { factor: "Potassium", optimal: 78, low: 50, high: 65 },
  { factor: "Organic Matter", optimal: 82, low: 52, high: 60 },
];

const cropTypeData = [
  { name: "Wheat", value: 35 },
  { name: "Corn", value: 25 },
  { name: "Rice", value: 20 },
  { name: "Soybean", value: 15 },
  { name: "Other", value: 5 },
];

const yieldTrendData = [
  { year: "2015", yield: 58 },
  { year: "2016", yield: 62 },
  { year: "2017", yield: 59 },
  { year: "2018", yield: 65 },
  { year: "2019", yield: 67 },
  { year: "2020", yield: 63 },
  { year: "2021", yield: 70 },
  { year: "2022", yield: 75 },
  { year: "2023", yield: 78 },
  { year: "2024", yield: 82 },
];

const COLORS = ["#82E30D", "#34A853", "#FBBC05", "#4285F4", "#EA4335"];

const Visualize = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("yield-trends");

  const downloadChart = (chartName: string) => {
    toast.success(`${chartName} chart downloaded`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Data Visualization</h1>
      <p className="text-muted-foreground mb-6">
        Explore visual insights about crop yields and environmental factors
      </p>

      {!isAuthenticated && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in for full access to all visualization features.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="yield-trends">Yield Trends</TabsTrigger>
          <TabsTrigger value="crop-comparison">Crop Comparison</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
          <TabsTrigger value="distribution">Crop Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="yield-trends">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Crop Yield Trends (2015-2024)</CardTitle>
                <CardDescription>
                  Average yield trends over the past decade
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadChart("Yield Trend")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={yieldTrendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82E30D" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82E30D" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis 
                      label={{ value: 'Yield (bushels/acre)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="yield"
                      stroke="#82E30D"
                      fillOpacity={1}
                      fill="url(#colorYield)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This chart shows the average yield trend across all major crops over the past decade, indicating an overall improvement in agricultural productivity.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crop-comparison">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Monthly Crop Yield Comparison</CardTitle>
                <CardDescription>
                  Comparing average yields for major crops throughout the year
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadChart("Crop Comparison")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyYieldData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      label={{ value: 'Yield (bushels/acre)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="wheat"
                      stroke="#82E30D"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="corn"
                      stroke="#4285F4"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="rice"
                      stroke="#FBBC05"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This chart compares the monthly yields of wheat, corn, and rice throughout the year. Each crop has its optimal growing seasons, as reflected in the yield patterns.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Environmental Factors and Yield Impact</CardTitle>
                <CardDescription>
                  How different environmental factors affect crop yield
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadChart("Environmental Impact")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={environmentalImpactData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="factor" />
                    <YAxis 
                      label={{ value: 'Yield percentage (%)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="optimal" name="Optimal Conditions" fill="#82E30D" />
                    <Bar dataKey="low" name="Below Optimal" fill="#FBBC05" />
                    <Bar dataKey="high" name="Above Optimal" fill="#EA4335" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This chart shows how different environmental and soil factors affect crop yield. The green bars represent yield under optimal conditions, while yellow and red show yields when factors are below or above optimal levels.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Crop Type Distribution</CardTitle>
                <CardDescription>
                  Distribution of different crop types by percentage
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadChart("Crop Distribution")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {cropTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>This chart shows the distribution of different crop types as a percentage of total cultivated area. Wheat is the dominant crop, followed by corn and rice.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Visualize;
