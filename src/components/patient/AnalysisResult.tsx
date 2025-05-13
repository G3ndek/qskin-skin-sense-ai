
import React, { useEffect, useState } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const AnalysisResult: React.FC = () => {
  const { state, analyzeImage, goToNextStep, goToPreviousStep } = usePatient();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<string>('Initializing AI model...');
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const intervalId = setInterval(() => {
      if (isMounted) {
        setProgress(prev => {
          const newValue = Math.min(prev + 2, 95);
          // Update analysis stage based on progress
          if (newValue > 20 && newValue <= 40 && analysisStage !== 'Identifying skin features...') {
            setAnalysisStage('Identifying skin features...');
          } else if (newValue > 40 && newValue <= 70 && analysisStage !== 'Analyzing skin condition...') {
            setAnalysisStage('Analyzing skin condition...');
          } else if (newValue > 70 && newValue < 95 && analysisStage !== 'Generating assessment...') {
            setAnalysisStage('Generating assessment...');
          }
          return newValue;
        });
      }
    }, 50);
    
    const performAnalysis = async () => {
      try {
        // Analyze image
        await analyzeImage();
        
        if (isMounted) {
          setProgress(100);
          setAnalysisStage('Analysis complete!');
          setTimeout(() => {
            if (isMounted) {
              setIsAnalyzing(false);
            }
          }, 500);
          
          toast({
            title: "Analysis Complete",
            description: "We've successfully analyzed your skin image.",
            variant: "default",
          });
        }
      } catch (error) {
        if (isMounted) {
          setAnalysisError("There was an error analyzing your image. Please try again.");
          toast({
            title: "Analysis Error",
            description: "There was a problem analyzing your skin image. Please try again.",
            variant: "destructive",
          });
          setIsAnalyzing(false);
        }
      }
    };
    
    performAnalysis();
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []); // Run once on component mount

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

  const getSeverityIcon = () => {
    switch (state.analysisResult.severity) {
      case 'mild':
        return <CheckCircle className="h-5 w-5 text-green-600 mr-2" />;
      case 'moderate':
        return <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />;
      case 'severe':
        return <AlertCircle className="h-5 w-5 text-red-600 mr-2" />;
      default:
        return <FileText className="h-5 w-5 mr-2" />;
    }
  };

  const handleRetryAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisError(null);
    setAnalysisStage('Initializing AI model...');
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
                {analysisStage}
              </p>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1 animate-pulse text-pink-500" />
              <span>{progress}% complete</span>
            </div>
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
                {getSeverityIcon()}
                {state.analysisResult.severity === 'mild' && 'Mild Acne Detected'}
                {state.analysisResult.severity === 'moderate' && 'Moderate Acne Detected'}
                {state.analysisResult.severity === 'severe' && 'Severe Acne Detected'}
              </AlertTitle>
              <AlertDescription>
                {state.analysisResult.description}
              </AlertDescription>
            </Alert>

            <div className="space-y-3 p-4 bg-pink-50 rounded-md">
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
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium shadow-md flex items-center px-6 py-2.5 text-base"
        >
          Continue to Chat
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisResult;
