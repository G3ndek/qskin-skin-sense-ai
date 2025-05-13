
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
      // If "None of the above" is checked, uncheck all others
      updatePrescreening({
        hasEczema: false,
        hasRosacea: false,
        hasOpenWounds: false,
        isPregnant: false,
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
          For your safety, please answer the following questions before proceeding.
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
              id="hasEczema" 
              checked={state.prescreeningResults.hasEczema}
              onCheckedChange={(checked) => 
                handleConditionChange('hasEczema', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasEczema" className="font-medium">Severe eczema</Label>
              <p className="text-sm text-gray-500">Patches of skin that are inflamed, itchy, red, cracked, and rough.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="hasRosacea" 
              checked={state.prescreeningResults.hasRosacea}
              onCheckedChange={(checked) => 
                handleConditionChange('hasRosacea', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasRosacea" className="font-medium">Rosacea</Label>
              <p className="text-sm text-gray-500">Condition that causes facial redness, visible blood vessels, and sometimes small red bumps.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="hasOpenWounds" 
              checked={state.prescreeningResults.hasOpenWounds}
              onCheckedChange={(checked) => 
                handleConditionChange('hasOpenWounds', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="hasOpenWounds" className="font-medium">Open wounds</Label>
              <p className="text-sm text-gray-500">Any breaks in the skin that are open and potentially susceptible to infection.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="isPregnant" 
              checked={state.prescreeningResults.isPregnant}
              onCheckedChange={(checked) => 
                handleConditionChange('isPregnant', checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="isPregnant" className="font-medium">Pregnancy</Label>
              <p className="text-sm text-gray-500">Currently pregnant or breastfeeding.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2 border-t">
            <Checkbox 
              id="noneOfTheAbove" 
              checked={state.prescreeningResults.noneOfTheAbove}
              onCheckedChange={(checked) => handleNoneChange(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="noneOfTheAbove" className="font-medium">None of the above</Label>
              <p className="text-sm text-gray-500">I do not have any of the conditions listed above.</p>
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
