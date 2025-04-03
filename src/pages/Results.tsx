
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, LineChart, Line } from "recharts";

const dummyDataCurrent = [
  {
    crop: "Corn",
    predictedYield: 8.2,
    actualYield: 7.9,
    confidenceScore: 92,
    date: "2024-03-15",
  },
  {
    crop: "Wheat",
    predictedYield: 4.5,
    actualYield: 4.3,
    confidenceScore: 88,
    date: "2024-03-10",
  },
  {
    crop: "Soybeans",
    predictedYield: 3.7,
    actualYield: 3.8,
    confidenceScore: 85,
    date: "2024-03-05",
  },
];

const dummyDataHistorical = [
  {
    crop: "Corn",
    predictedYield: 7.7,
    actualYield: 7.5,
    confidenceScore: 89,
    date: "2023-09-20",
  },
  {
    crop: "Wheat",
    predictedYield: 4.1,
    actualYield: 4.0,
    confidenceScore: 92,
    date: "2023-08-15",
  },
  {
    crop: "Soybeans",
    predictedYield: 3.5,
    actualYield: 3.4,
    confidenceScore: 87,
    date: "2023-08-10",
  },
  {
    crop: "Corn",
    predictedYield: 7.4,
    actualYield: 7.3,
    confidenceScore: 90,
    date: "2023-03-25",
  },
  {
    crop: "Wheat",
    predictedYield: 3.9,
    actualYield: 3.7,
    confidenceScore: 88,
    date: "2023-03-12",
  },
];

const explanationFactors = [
  {
    factor: "Soil pH",
    impact: 25,
    explanation: "Slightly alkaline soil pH (7.2) is optimal for corn growth",
    color: "#8884d8",
  },
  {
    factor: "Nitrogen Level",
    impact: 35,
    explanation: "High nitrogen level promotes robust vegetative growth",
    color: "#82ca9d",
  },
  {
    factor: "Rainfall",
    impact: 20,
    explanation: "Adequate rainfall distribution throughout the growing season",
    color: "#ffc658",
  },
  {
    factor: "Temperature",
    impact: 15,
    explanation: "Optimal temperature range during key growth stages",
    color: "#ff8042",
  },
  {
    factor: "Pest Management",
    impact: 5,
    explanation: "Effective pest control reduced crop damage",
    color: "#0088FE",
  },
];

const yieldTrendData = [
  { name: "Jan", yield: 2.4 },
  { name: "Feb", yield: 2.7 },
  { name: "Mar", yield: 3.2 },
  { name: "Apr", yield: 3.8 },
  { name: "May", yield: 4.5 },
  { name: "Jun", yield: 5.2 },
  { name: "Jul", yield: 5.8 },
  { name: "Aug", yield: 6.5 },
  { name: "Sep", yield: 7.1 },
  { name: "Oct", yield: 7.8 },
  { name: "Nov", yield: 0 },
  { name: "Dec", yield: 0 },
];

const ResultsTable = ({ data }: { data: typeof dummyDataCurrent }) => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="py-3 px-4 text-left font-medium">Crop</th>
            <th className="py-3 px-4 text-left font-medium">Predicted Yield (tons/ha)</th>
            <th className="py-3 px-4 text-left font-medium">Actual Yield (tons/ha)</th>
            <th className="py-3 px-4 text-left font-medium">Confidence Score</th>
            <th className="py-3 px-4 text-left font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 ? "bg-muted/50" : "bg-background"}>
              <td className="py-3 px-4">{row.crop}</td>
              <td className="py-3 px-4">{row.predictedYield.toFixed(1)}</td>
              <td className="py-3 px-4">{row.actualYield.toFixed(1)}</td>
              <td className="py-3 px-4">{row.confidenceScore}%</td>
              <td className="py-3 px-4">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Results = () => {
  const [selectedTab, setSelectedTab] = useState("current");

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // Custom tooltip for the bar chart that handles valueType properly
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Make sure to check the type before using toFixed
      const valueFormatted = typeof payload[0].value === 'number' ? 
        payload[0].value.toFixed(2) : 
        payload[0].value.toString();
        
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p>{`${payload[0].name}: ${valueFormatted}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Prediction Results</h1>
        <p className="text-muted-foreground mt-2">
          Review your crop yield prediction results and explanatory factors.
        </p>
      </div>

      <Tabs defaultValue="current" onValueChange={setSelectedTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="current">Current Season</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Season Predictions</CardTitle>
              <CardDescription>Latest predictions for your crops with actual yields where available</CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsTable data={dummyDataCurrent} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="historical">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Historical Predictions</CardTitle>
              <CardDescription>Previous predictions and their accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsTable data={dummyDataHistorical} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Accuracy</CardTitle>
            <CardDescription>Comparing predicted vs actual yields</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedTab === "current" ? dummyDataCurrent : dummyDataHistorical}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis label={{ value: "Yield (tons/ha)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar name="Predicted Yield" dataKey="predictedYield" fill="#8884d8" />
                <Bar name="Actual Yield" dataKey="actualYield" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Explanatory Factors</CardTitle>
            <CardDescription>Key factors influencing the prediction</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={explanationFactors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="impact"
                >
                  {explanationFactors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Yield Trend Over Time</CardTitle>
            <CardDescription>Growth pattern during the current growing season</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yieldTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "Yield (tons/ha)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Factor Analysis</CardTitle>
            <CardDescription>Explanation of each factor's impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {explanationFactors.map((factor, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium">{factor.factor}</h4>
                    <span 
                      className="px-2 py-1 rounded-md text-xs" 
                      style={{ backgroundColor: factor.color + '20', color: factor.color }}
                    >
                      Impact: {factor.impact}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.explanation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on prediction results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h4 className="font-medium">Irrigation Management</h4>
                <p className="text-sm text-muted-foreground">
                  Consider increasing irrigation frequency by 15% during the upcoming dry period to 
                  maintain optimal soil moisture levels for corn development.
                </p>
              </div>
              <div className="border-b pb-3">
                <h4 className="font-medium">Nutrient Management</h4>
                <p className="text-sm text-muted-foreground">
                  Apply additional nitrogen fertilizer (20 kg/ha) at the V8 growth stage to support 
                  kernel development. This could potentially increase yield by 8-10%.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Pest Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Increase vigilance for corn borer activity in the next 2-3 weeks, as conditions 
                  are favorable for infestation. Early detection can prevent yield losses of up to 15%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline">Export Data</Button>
        <Button>Generate Full Report</Button>
      </div>
    </div>
  );
};

export default Results;
