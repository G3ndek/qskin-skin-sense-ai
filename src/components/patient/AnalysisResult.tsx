
import React, { useEffect, useState } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const AnalysisResult: React.FC = () => {
  const { state, analyzeImage, goToNextStep, goToPreviousStep } = usePatient();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const startAnalysis = async () => {
      setIsAnalyzing(true);
      setProgress(0);
      setAnalysisError(null);
      
      // Mock progress bar
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 95));
      }, 50);
      
      try {
        // Analyze image
        await analyzeImage();
        
        clearInterval(interval);
        setProgress(100);
        
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 500);
      } catch (error) {
        clearInterval(interval);
        setAnalysisError("There was an error analyzing your image. Please try again.");
        toast({
          title: "Analysis Error",
          description: "There was a problem analyzing your skin image. Please try again.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
      }
    };
    
    startAnalysis();
  }, [analyzeImage, toast]);

  const getSeverityColor = () => {
    switch (state.analysisResult.severity) {
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRetryAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisError(null);
    await analyzeImage();
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">AI Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAnalyzing ? (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Analyzing your skin...</h3>
              <p className="text-sm text-gray-500">
                Our AI is examining your photo for skin conditions.
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : analysisError ? (
          <div className="space-y-4 py-8">
            <Alert variant="destructive">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                {analysisError}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button onClick={handleRetryAnalysis} className="mt-4">
                Retry Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <img
                src={state.uploadedImage || ''}
                alt="Analyzed face"
                className="w-64 h-64 object-cover rounded-md border"
              />
            </div>

            <Alert className={getSeverityColor()}>
              <AlertTitle className="text-lg font-semibold flex items-center">
                {state.analysisResult.severity === 'mild' && 'Mild Acne Detected'}
                {state.analysisResult.severity === 'moderate' && 'Moderate Acne Detected'}
                {state.analysisResult.severity === 'severe' && 'Severe Acne Detected'}
              </AlertTitle>
              <AlertDescription>
                {state.analysisResult.description}
              </AlertDescription>
            </Alert>

            <div className="space-y-3 p-4 bg-qskyn-50 rounded-md">
              <h4 className="font-medium">What this means:</h4>
              <p className="text-sm text-gray-700">
                Our AI has analyzed your skin and detected signs of {state.analysisResult.severity} acne. 
                This assessment is based on the number, type, and distribution of acne lesions visible in your photo.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep} disabled={isAnalyzing}>
          Back
        </Button>
        <Button 
          onClick={goToNextStep} 
          disabled={isAnalyzing || analysisError !== null} 
          className="bg-qskyn-500 hover:bg-qskyn-600"
        >
          Continue to Chat
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisResult;
