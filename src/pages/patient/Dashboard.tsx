
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Package, Users, ChevronRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Patient'}</h1>
          <p className="text-gray-600">
            Manage your skin health and treatments all in one place.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Start New Assessment</CardTitle>
                  <CardDescription>
                    Get personalized treatment recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6 overflow-hidden rounded-md">
                    <AspectRatio ratio={16/9}>
                      <div className="bg-qskyn-50 h-full w-full flex items-center justify-center">
                        <div className="text-qskyn-500 text-6xl">QSkyn</div>
                      </div>
                    </AspectRatio>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/patient/screening">
                      Start Assessment
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>
                    View and track your prescriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 py-2">
                    <div className="p-2 bg-qskyn-50 rounded-md">
                      <Package className="h-8 w-8 text-qskyn-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Active Prescriptions</h3>
                      <p className="text-sm text-gray-500">
                        Check status of your current treatments
                      </p>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/patient/orders">
                      View Orders
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Connect with our skin care experts
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4 py-2">
                <div className="p-2 bg-qskyn-50 rounded-md">
                  <Users className="h-8 w-8 text-qskyn-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Skin Consultation</h3>
                  <p className="text-sm text-gray-500">
                    Our specialists are ready to help with your skin concerns
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>My Prescriptions & Orders</CardTitle>
                <CardDescription>
                  View all your treatments and current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p>
                    View your complete order history and prescription status.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/patient/orders">
                      Go to My Orders
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PatientDashboard;
