
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, FileUp, X } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Upload = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("soil");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, type: string, date: Date}>>([]);

  // Sample file templates
  const sampleSoilData = "timestamp,pH,moisture,temperature,nitrogen,phosphorus,potassium,organic_matter\n2023-06-01,6.5,0.32,22.5,120,45,80,3.2\n2023-06-15,6.7,0.28,24.1,115,42,75,3.0";
  const sampleEnvironmentalData = "timestamp,temperature,humidity,rainfall,sunshine_hours,wind_speed\n2023-06-01,25.3,65,0,8.5,12\n2023-06-15,27.8,58,10.2,6.2,8";
  const sampleCropData = "timestamp,crop_type,growth_stage,health_index,pest_presence,disease_presence\n2023-06-01,wheat,seedling,0.85,false,false\n2023-06-15,wheat,vegetative,0.92,true,false";

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to upload data files.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      
      // Check file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'csv') {
        toast.error("Only CSV files are supported.");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const simulateUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add to uploaded files
          setUploadedFiles(prev => [...prev, {
            name: selectedFile.name,
            type: activeTab,
            date: new Date()
          }]);
          setSelectedFile(null);
          toast.success("File uploaded successfully!");
          return 0;
        }
        return prev + 5;
      });
    }, 150);
  };

  const downloadTemplate = (template: string, filename: string) => {
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Template ${filename} downloaded!`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const deleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success("File deleted successfully!");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Data Upload</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="soil">Soil Data</TabsTrigger>
              <TabsTrigger value="environmental">Environmental Data</TabsTrigger>
              <TabsTrigger value="crop">Crop Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="soil" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Soil Data</CardTitle>
                  <CardDescription>
                    Upload your soil analysis data in CSV format. Include pH, moisture, nutrients, and organic matter.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="mx-auto max-w-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => downloadTemplate(sampleSoilData, 'soil_data_template.csv')}
                      >
                        Download Template
                      </Button>
                      {selectedFile && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      disabled={!selectedFile || isUploading}
                      onClick={simulateUpload}
                    >
                      Upload Soil Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="environmental" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Environmental Data</CardTitle>
                  <CardDescription>
                    Upload weather and environmental data in CSV format. Include temperature, humidity, rainfall, and other metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="mx-auto max-w-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => downloadTemplate(sampleEnvironmentalData, 'environmental_data_template.csv')}
                      >
                        Download Template
                      </Button>
                      {selectedFile && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      disabled={!selectedFile || isUploading}
                      onClick={simulateUpload}
                    >
                      Upload Environmental Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="crop" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Crop Data</CardTitle>
                  <CardDescription>
                    Upload crop growth and health data in CSV format. Include crop type, growth stage, and health indicators.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="mx-auto max-w-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => downloadTemplate(sampleCropData, 'crop_data_template.csv')}
                      >
                        Download Template
                      </Button>
                      {selectedFile && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} />
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      disabled={!selectedFile || isUploading}
                      onClick={simulateUpload}
                    >
                      Upload Crop Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                Recently uploaded data files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedFiles.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No files uploaded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.type.charAt(0).toUpperCase() + file.type.slice(1)} • {formatDate(file.date)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                {user?.role === "admin" || user?.role === "researcher" 
                  ? "You have full access to upload and manage all data files."
                  : "Farmers can upload their own field data for analysis."}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
