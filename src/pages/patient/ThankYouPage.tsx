
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        <Card className="border-softpink-200 shadow-md">
          <CardHeader className="bg-softpink-500 text-white px-6 py-8 flex flex-col items-center justify-center">
            <CheckCircle className="h-16 w-16 mb-4 text-white" />
            <h1 className="text-2xl font-bold text-center">Thank You!</h1>
            <p className="text-softpink-100 text-center">
              Your QSkyn AI consultation is complete
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-softpink-50 border border-softpink-100 rounded-lg p-4">
                <h2 className="text-lg font-medium text-softpink-800 mb-2">
                  What happens next?
                </h2>
                <p className="text-gray-700">
                  Thank you for participating in the session. We are now preparing your 
                  prescription based on the information you provided. Our dermatologist 
                  will review your case and approve the appropriate treatment.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h2 className="text-lg font-medium text-blue-800 mb-2">
                  Important Information
                </h2>
                <p className="text-gray-700">
                  Please check the status of your prescription in the <strong>"My Orders"</strong> tab. 
                  You'll receive a notification once your prescription has been approved and is ready.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <h2 className="text-lg font-medium text-green-800 mb-2">
                  Estimated Timeline
                </h2>
                <p className="text-gray-700">
                  Most prescriptions are processed within 24-48 hours. You'll receive an
                  email notification when your prescription is ready.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 p-6 flex justify-center border-t">
            <div className="space-x-4">
              <Button asChild className="bg-softpink-600 hover:bg-softpink-700 text-white font-medium shadow-md px-6 py-2.5 text-base">
                <Link to="/patient/orders">
                  View My Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-softpink-500 text-softpink-700 hover:bg-softpink-50">
                <Link to="/patient/dashboard">
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ThankYouPage;
