
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface FileData {
  url: string;
  type: string;
  name: string;
}

interface PatientState {
  currentStep: number;
  prescreeningResults: {
    isPregnant: boolean;
    isUsingAccutane: boolean;
    hasSkinConditions: boolean;
    hasAllergy: boolean;
    hasSkinLesions: boolean;
    hasSkinCancer: boolean;
    noneOfTheAbove: boolean;
  };
  uploadedFile: FileData | null;
  analysisResult: {
    severity: 'mild' | 'moderate' | 'severe' | null;
    description: string;
  };
  messages: {
    id: string;
    sender: 'patient' | 'ai';
    text: string;
    timestamp: Date;
  }[];
  sessionCompleted: boolean;
}

interface PatientContextType {
  state: PatientState;
  updatePrescreening: (data: Partial<PatientState['prescreeningResults']>) => void;
  uploadFile: (fileData: FileData | null) => void;
  analyzeImage: () => Promise<void>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  sendMessage: (message: string) => void;
  resetState: () => void;
}

const initialState: PatientState = {
  currentStep: 1,
  prescreeningResults: {
    isPregnant: false,
    isUsingAccutane: false,
    hasSkinConditions: false,
    hasAllergy: false,
    hasSkinLesions: false,
    hasSkinCancer: false,
    noneOfTheAbove: false,
  },
  uploadedFile: null,
  analysisResult: {
    severity: null,
    description: '',
  },
  messages: [],
  sessionCompleted: false,
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [state, setState] = useState<PatientState>(initialState);
  const navigate = useNavigate();
  
  // Check if session is complete (6 messages total)
  useEffect(() => {
    if (state.messages.length >= 6 && !state.sessionCompleted) {
      setState(prev => ({ ...prev, sessionCompleted: true }));
      toast({
        title: "Session Complete",
        description: "Thank you for completing your consultation.",
      });
      navigate('/patient/thank-you');
    }
  }, [state.messages, state.sessionCompleted, navigate]);

  const updatePrescreening = (data: Partial<PatientState['prescreeningResults']>) => {
    setState(prev => ({
      ...prev,
      prescreeningResults: {
        ...prev.prescreeningResults,
        ...data,
      },
    }));
  };

  const uploadFile = (fileData: FileData | null) => {
    setState(prev => ({
      ...prev,
      uploadedFile: fileData,
    }));
  };

  const analyzeImage = async () => {
    // Mock image analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setState(prev => ({
      ...prev,
      analysisResult: {
        severity: 'moderate',
        description: 'Moderate acne detected on cheeks and forehead.',
      },
      messages: [
        {
          id: '1',
          sender: 'ai',
          text: 'Hi! Based on your upload, I see signs of moderate acne. Let\'s continue.',
          timestamp: new Date(),
        },
      ],
    }));
  };

  const goToNextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };

  const goToPreviousStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  };

  const sendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'patient' as const,
      text: message,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    // Mock AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai' as const,
        text: `Thank you for sharing. Based on what you've told me, I recommend keeping your skin clean and using a gentle cleanser twice daily. Avoid touching your face and use non-comedogenic moisturizers.`,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
      }));
    }, 1500);
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <PatientContext.Provider
      value={{
        state,
        updatePrescreening,
        uploadFile,
        analyzeImage,
        goToNextStep,
        goToPreviousStep,
        sendMessage,
        resetState,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
