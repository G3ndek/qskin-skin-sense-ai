
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PatientState {
  currentStep: number;
  prescreeningResults: {
    hasEczema: boolean;
    hasRosacea: boolean;
    hasOpenWounds: boolean;
    isPregnant: boolean;
    noneOfTheAbove: boolean;
  };
  uploadedImage: string | null;
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
}

interface PatientContextType {
  state: PatientState;
  updatePrescreening: (data: Partial<PatientState['prescreeningResults']>) => void;
  uploadImage: (imageUrl: string) => void;
  analyzeImage: () => Promise<void>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  sendMessage: (message: string) => void;
  resetState: () => void;
}

const initialState: PatientState = {
  currentStep: 1,
  prescreeningResults: {
    hasEczema: false,
    hasRosacea: false,
    hasOpenWounds: false,
    isPregnant: false,
    noneOfTheAbove: false,
  },
  uploadedImage: null,
  analysisResult: {
    severity: null,
    description: '',
  },
  messages: [],
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

  const updatePrescreening = (data: Partial<PatientState['prescreeningResults']>) => {
    setState(prev => ({
      ...prev,
      prescreeningResults: {
        ...prev.prescreeningResults,
        ...data,
      },
    }));
  };

  const uploadImage = (imageUrl: string) => {
    setState(prev => ({
      ...prev,
      uploadedImage: imageUrl,
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
          text: 'Hi! Based on your image, I see signs of moderate acne. Let\'s continue.',
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
        uploadImage,
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
