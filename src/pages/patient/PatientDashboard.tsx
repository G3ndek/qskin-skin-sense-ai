
import React from 'react';
import { usePatient } from '@/contexts/PatientContext';
import MainLayout from '@/components/layout/MainLayout';
import ScreeningForm from '@/components/patient/ScreeningForm';
import ImageUpload from '@/components/patient/ImageUpload';
import AnalysisResult from '@/components/patient/AnalysisResult';
import ChatInterface from '@/components/patient/ChatInterface';

const PatientDashboard: React.FC = () => {
  const { state } = usePatient();

  // Render the appropriate step
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <ScreeningForm />;
      case 2:
        return <ImageUpload />;
      case 3:
        return <AnalysisResult />;
      case 4:
        return <ChatInterface />;
      default:
        return <ScreeningForm />;
    }
  };

  // Generate step status classes
  const getStepStatusClass = (stepNumber: number) => {
    if (state.currentStep > stepNumber) {
      return 'text-qskin-600 dark:text-qskyn-highlight font-medium'; // Completed step
    } else if (state.currentStep === stepNumber) {
      return 'text-pink-600 dark:text-qskyn-primary font-medium'; // Current step
    }
    return 'text-gray-400 dark:text-qskyn-darkText/50'; // Future step
  };

  // Generate progress bar classes
  const getProgressBarClass = (stepNumber: number) => {
    if (state.currentStep > stepNumber) {
      return 'bg-qskin-500 dark:bg-qskyn-highlight'; // Completed step
    } else if (state.currentStep === stepNumber) {
      return 'bg-pink-500 dark:bg-qskyn-primary'; // Current step
    }
    return 'bg-gray-200 dark:bg-qskyn-darkBorder'; // Future step
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold dark:text-qskyn-darkHeading">Skin Assessment</h1>
            <div className="text-sm text-gray-500 dark:text-qskyn-darkText">
              Step {state.currentStep} of 4
            </div>
          </div>
          
          <div className="relative mb-8">
            <div className="flex mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 text-center ${getStepStatusClass(step)}`}
                >
                  <span className="text-xs">
                    {step === 1 && 'Pre-screening'}
                    {step === 2 && 'Upload Photos'}
                    {step === 3 && 'Analysis'}
                    {step === 4 && 'Consultation'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200 dark:bg-qskyn-darkBorder">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 ${getProgressBarClass(step)}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;
