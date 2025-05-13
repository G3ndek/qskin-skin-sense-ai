
import React from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const ScreeningForm: React.FC = () => {
  const { state, updatePrescreening, goToNextStep } = usePatient();
  const { toast } = useToast();
  
  const handleNoneChange = (checked: boolean) => {
    if (checked) {
      // If "None of these apply to me" is checked, uncheck all others
      updatePrescreening({
        isPregnant: false,
        isUsingAccutane: false,
        hasSkinConditions: false,
        hasAllergy: false,
        hasSkinLesions: false,
        hasSkinCancer: false,
        noneOfTheAbove: true,
      });
    } else {
      updatePrescreening({ noneOfTheAbove: false });
    }
  };

  const handleConditionChange = (condition: keyof typeof state.prescreeningResults, checked: boolean) => {
    if (condition !== 'noneOfTheAbove') {
      const update = { [condition]: checked } as Partial<typeof state.prescreeningResults>;
      
      // If any condition is checked, uncheck "None of the above"
      if (checked) {
        update.noneOfTheAbove = false;
      }
      
      updatePrescreening(update);
    }
  };

  const handleSubmit = () => {
    if (!state.prescreeningResults.noneOfTheAbove) {
      toast({
        title: "Medical conditions detected",
        description: "Our service requires you to have none of the listed conditions. Please consult a doctor in person.",
        variant: "destructive",
      });
      return;
    }
    
    goToNextStep();
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Medical Pre-Screening</CardTitle>
        <p className="text-center text-gray-500 mt-1">
          Please confirm the following are not true for you:
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Please note that QSkin is not designed for severe skin conditions. If you have any of the following, we recommend consulting with a dermatologist in person.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="isPregnant" 
              checked={state.prescreeningResults.isPregnant}
              onCheckedChange={(checked) => 
                handleConditionChange('isPregnant', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="isPregnant" className="font-medium">I am pregnant or breastfeeding</Label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="isUsingAccutane" 
              checked={state.prescreeningResults.isUsingAccutane}
              onCheckedChange={(checked) => 
                handleConditionChange('isUsingAccutane', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="isUsingAccutane" className="font-medium">I am currently using Accutane (isotretinoin)</Label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="hasSkinConditions" 
              checked={state.prescreeningResults.hasSkinConditions}
              onCheckedChange={(checked) => 
                handleConditionChange('hasSkinConditions', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasSkinConditions" className="font-medium">I have eczema, rosacea, or photosensitivity</Label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="hasAllergy" 
              checked={state.prescreeningResults.hasAllergy}
              onCheckedChange={(checked) => 
                handleConditionChange('hasAllergy', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasAllergy" className="font-medium">I'm allergic to tretinoin or retinoids</Label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="hasSkinLesions" 
              checked={state.prescreeningResults.hasSkinLesions}
              onCheckedChange={(checked) => 
                handleConditionChange('hasSkinLesions', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasSkinLesions" className="font-medium">I have unusual skin lesions or growths</Label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="hasSkinCancer" 
              checked={state.prescreeningResults.hasSkinCancer}
              onCheckedChange={(checked) => 
                handleConditionChange('hasSkinCancer', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasSkinCancer" className="font-medium">I have a history of skin cancer</Label>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-4 mt-2 border-t">
            <Checkbox 
              id="noneOfTheAbove" 
              checked={state.prescreeningResults.noneOfTheAbove}
              onCheckedChange={(checked) => handleNoneChange(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="noneOfTheAbove" className="font-medium">None of these apply to me</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!state.prescreeningResults.noneOfTheAbove}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScreeningForm;
