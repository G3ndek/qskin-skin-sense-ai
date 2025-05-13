
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DoctorDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to QSkin Doctor Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This is a placeholder for the doctor's dashboard. In a full implementation, 
              this would show patient cases, pending reviews, and other doctor-specific features.
            </p>
            <p className="text-gray-600">
              Currently, we're focusing on the patient flow as requested.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DoctorDashboard;
