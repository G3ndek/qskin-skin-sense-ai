
import React, { useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoaderCircle } from 'lucide-react';

const AnalysisResult: React.FC = () => {
  const { goToNextStep, analyzeImage } = usePatient();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const prepareConsultation = async () => {
      try {
        // Analyze image in the background
        await analyzeImage();
        
        if (isMounted) {
          // Show toast notification
          toast({
            title: "Preparing Consultation",
            description: "Your AI assistant is ready to chat with you.",
            variant: "default",
          });
          
          // Wait for 3 seconds, then proceed to chat
          setTimeout(() => {
            if (isMounted) {
              goToNextStep();
            }
          }, 3000);
        }
      } catch (error) {
        if (isMounted) {
          toast({
            title: "Preparation Error",
            description: "There was a problem preparing your consultation. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    prepareConsultation();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Run once on component mount

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center dark:text-qskyn-darkHeading">Preparing Your Consultation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-16 w-16 text-pink-500 dark:text-qskyn-primary animate-spin" />
          <p className="mt-6 text-lg text-gray-700 dark:text-qskyn-darkHeading">Preparing your AI consultation session...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-qskyn-darkText">You will be redirected to chat in a moment</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;
