
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        <div className="max-w-4xl text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-qskin-600 to-qskin-400 bg-clip-text text-transparent">
              AI-Powered Dermatology
            </span>
            <br />
            <span>For Healthy Skin</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            QSkin uses advanced AI to analyze your skin condition and provide personalized advice from dermatology professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-qskin-100 flex items-center justify-center mb-4">
              <span className="text-qskin-600 text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Photo</h3>
            <p className="text-gray-600">
              Take a clear photo of your skin concern and upload it securely to our platform.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-qskin-100 flex items-center justify-center mb-4">
              <span className="text-qskin-600 text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our advanced AI examines your photo to identify skin conditions and severity levels.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-qskin-100 flex items-center justify-center mb-4">
              <span className="text-qskin-600 text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
            <p className="text-gray-600">
              Receive personalized treatment recommendations and skin care advice.
            </p>
          </div>
        </div>
        
        <div className="w-full bg-qskin-50 rounded-lg p-8 my-8 max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">Why Choose QSkin?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-qskin-200 flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-medium mb-1">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our advanced algorithms provide accurate skin assessments within minutes.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-qskin-200 flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-medium mb-1">Medical Expertise</h3>
                <p className="text-sm text-gray-600">
                  Developed with leading dermatologists to ensure quality advice.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-qskin-200 flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-medium mb-1">Privacy First</h3>
                <p className="text-sm text-gray-600">
                  Your data and images are encrypted and handled with the highest privacy standards.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-qskin-200 flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="font-medium mb-1">Accessible Care</h3>
                <p className="text-sm text-gray-600">
                  Get dermatological advice without waiting for appointments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
