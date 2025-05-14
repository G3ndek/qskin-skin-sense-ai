import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { FileText, ChevronRight, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

// Updated order status to match requirements
type OrderStatus = 'Pending' | 'Approved' | 'Rejected';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  description: string;
  status: OrderStatus;
  doctorName: string; // Added doctor name who made the decision
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  specialInstructions: string;
}

// Updated mock data for orders with doctor information
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'QSK-2048',
    date: new Date(2025, 4, 14), // May 14, 2025
    description: 'Acne treatment kit',
    status: 'Approved',
    doctorName: 'Dr. Sarah Johnson',
    medication: 'Tretinoin 0.05%',
    dosage: 'Apply pea-sized amount',
    frequency: 'Once daily at bedtime',
    duration: '12 weeks',
    specialInstructions: 'Avoid sun exposure. Use sunscreen daily. May cause dryness and peeling initially.'
  },
  {
    id: '2',
    orderNumber: 'QSK-2035',
    date: new Date(2025, 4, 2), // May 2, 2025
    description: 'Rosacea treatment',
    status: 'Pending',
    doctorName: 'Awaiting review',
    medication: 'Azelaic Acid 15%',
    dosage: 'Apply thin layer',
    frequency: 'Twice daily',
    duration: '8 weeks',
    specialInstructions: 'Avoid alcoholic beverages and spicy foods. Report any increased redness or irritation.'
  },
  {
    id: '3',
    orderNumber: 'QSK-1982',
    date: new Date(2025, 3, 18), // April 18, 2025
    description: 'Anti-aging formula',
    status: 'Approved',
    doctorName: 'Dr. Michael Chen',
    medication: 'Retinol 0.1%, Hyaluronic Acid Serum',
    dosage: 'Apply 2-3 drops',
    frequency: 'Every other night',
    duration: '16 weeks',
    specialInstructions: 'Start slowly, increasing frequency as tolerated. Use moisturizer if irritation occurs.'
  },
  {
    id: '4',
    orderNumber: 'QSK-1845',
    date: new Date(2025, 2, 5), // March 5, 2025
    description: 'Eczema relief',
    status: 'Rejected',
    doctorName: 'Dr. Rebecca Wong',
    medication: 'Hydrocortisone 1%, Ceramide Moisturizer',
    dosage: 'Apply thin layer to affected areas',
    frequency: 'Twice daily for one week, then as needed',
    duration: '4 weeks',
    specialInstructions: 'Not approved for extended use on face or near eyes. Consider allergy testing.'
  },
];

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
  }
};

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    // Find the most recent approved order to show as active
    const approved = mockOrders.filter(order => order.status === 'Approved');
    if (approved.length > 0) {
      // Sort by date descending to get the most recent
      const sorted = [...approved].sort((a, b) => b.date.getTime() - a.date.getTime());
      setActiveOrder(sorted[0]);
    }
  }, []);
  
  const handleOpenPrescription = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-qskyn-darkHeading">Welcome back, {user?.name || 'Patient'}</h1>
          <p className="text-gray-600 dark:text-qskyn-darkText">
            Manage your skin health and treatments all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-pink-100 dark:border-qskyn-darkBorder">
            <CardHeader className="pb-3">
              <CardTitle>Start New Assessment</CardTitle>
              <CardDescription>
                Get personalized treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6 overflow-hidden rounded-md">
                <AspectRatio ratio={16/9}>
                  <div className="bg-pink-50 dark:bg-qskyn-primary/10 h-full w-full flex items-center justify-center">
                    <div className="text-pink-500 dark:text-qskyn-primary text-6xl">QSkyn</div>
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
          
          <Card className="border-pink-100 dark:border-qskyn-darkBorder">
            <CardHeader className="pb-3">
              <CardTitle>My Prescriptions</CardTitle>
              <CardDescription>
                View and track your prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeOrder ? (
                <Card className="bg-white dark:bg-qskyn-darkCard/60 border border-pink-100 dark:border-qskyn-darkBorder">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-pink-50 dark:bg-qskyn-primary/20 rounded-md">
                          <FileText className="h-4 w-4 text-pink-500 dark:text-qskyn-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium dark:text-qskyn-darkHeading">Active Prescription</h3>
                          <p className="text-xs text-gray-500 dark:text-qskyn-darkText/70">
                            {activeOrder.orderNumber} • {format(activeOrder.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(activeOrder.status)} border-0`}>
                        {activeOrder.status}
                      </Badge>
                    </div>
                    
                    <div className="bg-pink-50 dark:bg-qskyn-primary/10 p-3 rounded-md mb-3">
                      <div className="text-sm font-medium dark:text-qskyn-darkHeading">{activeOrder.medication}</div>
                      <div className="text-xs text-gray-600 dark:text-qskyn-darkText mt-1">{activeOrder.dosage} • {activeOrder.frequency}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenPrescription(activeOrder)}
                        className="dark:bg-qskyn-darkInput dark:text-qskyn-darkHeading"
                      >
                        View Details
                      </Button>
                      
                      <Button asChild variant="secondary" size="sm">
                        <Link to="/patient/orders">
                          All Prescriptions
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-start gap-4 py-2">
                  <div className="p-2 bg-pink-50 dark:bg-qskyn-primary/20 rounded-md">
                    <FileText className="h-8 w-8 text-pink-500 dark:text-qskyn-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-qskyn-darkHeading">No Active Prescriptions</h3>
                    <p className="text-sm text-gray-500 dark:text-qskyn-darkText">
                      Start an assessment to get personalized treatment recommendations
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-pink-100 dark:border-qskyn-darkBorder">
          <CardHeader>
            <CardTitle>How to Use QSkyn</CardTitle>
            <CardDescription>
              Quick guide to navigate and get the most out of the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 py-2">
              <div className="p-2 bg-pink-50 dark:bg-qskyn-primary/20 rounded-md">
                <HelpCircle className="h-8 w-8 text-pink-500 dark:text-qskyn-primary" />
              </div>
              <div>
                <h3 className="font-medium dark:text-qskyn-darkHeading">App Navigation Guide</h3>
                <p className="text-sm text-gray-500 dark:text-qskyn-darkText">
                  Learn how to use the QSkyn platform effectively
                </p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-gray-200 dark:border-qskyn-darkBorder">
                <AccordionTrigger className="dark:text-qskyn-darkHeading">How do I start a new skin assessment?</AccordionTrigger>
                <AccordionContent className="dark:text-qskyn-darkText">
                  Click the "Start Assessment" button on your dashboard. You'll begin with a pre-screening questionnaire about your skin concerns, followed by uploading images of your skin. Our AI will analyze your submission, and a dermatologist will review your case before providing personalized recommendations.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-gray-200 dark:border-qskyn-darkBorder">
                <AccordionTrigger className="dark:text-qskyn-darkHeading">Where can I view my prescriptions?</AccordionTrigger>
                <AccordionContent className="dark:text-qskyn-darkText">
                  Your active prescription is displayed directly on your dashboard. Click "View Details" to see complete information about your current prescription, or "All Prescriptions" to view your complete prescription history, including pending and past treatments.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-gray-200 dark:border-qskyn-darkBorder">
                <AccordionTrigger className="dark:text-qskyn-darkHeading">How do I chat with a dermatologist?</AccordionTrigger>
                <AccordionContent className="dark:text-qskyn-darkText">
                  After completing your skin assessment and receiving your analysis, you'll be able to access the chat feature. Navigate to your most recent assessment, and you'll find the chat option in the consultation step. You can ask questions about your treatment and receive guidance from our dermatology team.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-gray-200 dark:border-qskyn-darkBorder">
                <AccordionTrigger className="dark:text-qskyn-darkHeading">How do I track my treatment progress?</AccordionTrigger>
                <AccordionContent className="dark:text-qskyn-darkText">
                  You can start a new assessment at any time to upload new photos and track your skin's improvement. Compare your current skin condition with previous assessments to see how your treatment is working. Your dermatologist can also adjust your treatment plan based on your progress updates.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Prescription Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg dark:bg-qskyn-darkCard dark:border-qskyn-darkBorder">
          <DialogHeader>
            <DialogTitle className="text-xl dark:text-qskyn-darkHeading">
              Prescription #{selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription className="dark:text-qskyn-darkText">
              Issued on {selectedOrder && format(selectedOrder.date, 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium dark:text-qskyn-darkHeading">QSkyn Dermatology</h3>
                  <p className="text-sm text-gray-500 dark:text-qskyn-darkText/70">123 Main Street, Suite 500</p>
                  <p className="text-sm text-gray-500 dark:text-qskyn-darkText/70">New York, NY 10001</p>
                </div>
                <Badge className={`${getStatusColor(selectedOrder.status)} border-0`}>
                  {selectedOrder.status}
                </Badge>
              </div>
              
              <div className="border-t border-b py-4 border-gray-200 dark:border-qskyn-darkBorder">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Patient</h4>
                    <p className="font-medium dark:text-qskyn-darkHeading">{user?.name || 'Patient Name'}</p>
                    <p className="text-sm text-gray-700 dark:text-qskyn-darkText">ID: {user?.id || 'PATIENT-ID'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Prescribing Doctor</h4>
                    <p className="font-medium dark:text-qskyn-darkHeading">{selectedOrder.doctorName}</p>
                    <p className="text-sm text-gray-700 dark:text-qskyn-darkText">Board Certified Dermatologist</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-pink-50 dark:bg-qskyn-primary/10 p-4 rounded-lg border border-pink-100 dark:border-qskyn-darkBorder/50">
                <h3 className="font-bold text-gray-900 dark:text-qskyn-darkHeading mb-2">Treatment Information</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Medication</h4>
                      <p className="text-gray-900 dark:text-qskyn-darkHeading">{selectedOrder.medication}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Condition</h4>
                      <p className="text-gray-900 dark:text-qskyn-darkHeading">{selectedOrder.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Dosage</h4>
                      <p className="text-gray-900 dark:text-qskyn-darkHeading">{selectedOrder.dosage}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Frequency</h4>
                      <p className="text-gray-900 dark:text-qskyn-darkHeading">{selectedOrder.frequency}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider">Duration</h4>
                      <p className="text-gray-900 dark:text-qskyn-darkHeading">{selectedOrder.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 dark:text-qskyn-darkText/70 uppercase tracking-wider mb-1">Special Instructions</h4>
                <p className="text-sm bg-gray-50 dark:bg-qskyn-darkInput p-3 rounded-md border border-gray-200 dark:border-qskyn-darkBorder/50 dark:text-qskyn-darkText">
                  {selectedOrder.specialInstructions}
                </p>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-qskyn-darkText/80 italic">
                This prescription was issued digitally through QSkyn's telemedicine platform.
                If you have any questions or concerns, please contact your prescribing doctor.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PatientDashboard;
