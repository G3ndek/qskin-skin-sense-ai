
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Package, Users, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import order types from the MyOrders page
type OrderStatus = 'Active' | 'Pending' | 'Verified by dermatologist' | 'Shipped' | 'Received';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  description: string;
  status: OrderStatus;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'QSK-2048',
    date: new Date(2025, 4, 14), // May 14, 2025
    description: 'Acne treatment kit – Tretinoin 0.05%, moisturizer, cleanser',
    status: 'Shipped',
  },
  {
    id: '2',
    orderNumber: 'QSK-2035',
    date: new Date(2025, 4, 2), // May 2, 2025
    description: 'Rosacea treatment – Azelaic acid 15%, sensitive skin moisturizer',
    status: 'Verified by dermatologist',
  },
  {
    id: '3',
    orderNumber: 'QSK-1982',
    date: new Date(2025, 3, 18), // April 18, 2025
    description: 'Anti-aging formula – Retinol 0.1%, hyaluronic acid serum',
    status: 'Received',
  },
  {
    id: '4',
    orderNumber: 'QSK-1845',
    date: new Date(2025, 2, 5), // March 5, 2025
    description: 'Eczema relief – Hydrocortisone 1%, ceramide moisturizer',
    status: 'Active',
  },
];

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Active':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Verified by dermatologist':
      return 'bg-green-100 text-green-800';
    case 'Shipped':
      return 'bg-purple-100 text-purple-800';
    case 'Received':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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
                      <div className="bg-pink-50 h-full w-full flex items-center justify-center">
                        <div className="text-pink-500 text-6xl">QSkyn</div>
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
                    <div className="p-2 bg-pink-50 rounded-md">
                      <Package className="h-8 w-8 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Active Prescriptions</h3>
                      <p className="text-sm text-gray-500">
                        Check status of your current treatments
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={() => document.querySelector('[data-value="orders"]')?.click()} variant="outline" className="w-full">
                    View Orders
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Frequently asked questions about QSkyn services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 py-2">
                  <div className="p-2 bg-pink-50 rounded-md">
                    <Users className="h-8 w-8 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Common Questions</h3>
                    <p className="text-sm text-gray-500">
                      Find answers to your questions about our services
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How does the skin assessment work?</AccordionTrigger>
                    <AccordionContent>
                      Our skin assessment uses advanced AI technology to analyze your skin concerns through a questionnaire and uploaded photos. The system then provides personalized treatment recommendations reviewed by our dermatologists.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How long does it take to receive my prescription?</AccordionTrigger>
                    <AccordionContent>
                      After your assessment is approved by our doctors, prescriptions are typically processed within 24-48 hours and shipped within 1-2 business days. You can track the status of your order in the "My Orders" section.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I speak with a dermatologist directly?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can request a direct consultation with one of our board-certified dermatologists. This can be arranged through the chat feature after completing your skin assessment or by contacting our support team.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>What if the treatment doesn't work for me?</AccordionTrigger>
                    <AccordionContent>
                      We offer a 30-day satisfaction guarantee. If you're not seeing the expected results, please contact our support team for adjustments to your treatment plan or to discuss refund options.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button variant="secondary" size="sm" className="mt-4 w-full">
                  Contact Support
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
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Package className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-900">
                                  Order #{order.orderNumber}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-3">
                                {format(order.date, 'MMMM d, yyyy')}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} border-0`}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{order.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
