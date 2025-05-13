
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
      return 'text-qskyn-600 font-medium'; // Completed step
    } else if (state.currentStep === stepNumber) {
      return 'text-pink-600 font-medium'; // Current step
    }
    return 'text-gray-400'; // Future step
  };

  // Generate progress bar classes
  const getProgressBarClass = (stepNumber: number) => {
    if (state.currentStep > stepNumber) {
      return 'bg-qskyn-500'; // Completed step
    } else if (state.currentStep === stepNumber) {
      return 'bg-pink-500'; // Current step
    }
    return 'bg-gray-200'; // Future step
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Skin Assessment</h1>
            <div className="text-sm text-gray-500">
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
                    {step === 2 && 'Upload Photo'}
                    {step === 3 && 'Analysis'}
                    {step === 4 && 'Consultation'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
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
