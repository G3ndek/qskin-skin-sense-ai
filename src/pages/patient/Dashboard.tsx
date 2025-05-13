import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Package, Users, ChevronRight, FileText } from 'lucide-react';
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
      return 'bg-yellow-100 text-yellow-800';
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleOpenPrescription = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Patient'}</h1>
          <p className="text-gray-600">
            Manage your skin health and treatments all in one place.
          </p>
        </div>

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
              <CardTitle>My Prescriptions</CardTitle>
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
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/patient/orders">
                  View Prescriptions
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
                  After your assessment is approved by our doctors, prescriptions are typically processed within 24-48 hours and shipped within 1-2 business days. You can track the status of your order in the "My Prescriptions" section.
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
      </div>

      {/* Prescription Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Prescription #{selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Issued on {selectedOrder && format(selectedOrder.date, 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">QSkyn Dermatology</h3>
                  <p className="text-sm text-gray-500">123 Main Street, Suite 500</p>
                  <p className="text-sm text-gray-500">New York, NY 10001</p>
                </div>
                <Badge className={`${getStatusColor(selectedOrder.status)} border-0`}>
                  {selectedOrder.status}
                </Badge>
              </div>
              
              <div className="border-t border-b py-4 border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider">Patient</h4>
                    <p className="font-medium">{user?.name || 'Patient Name'}</p>
                    <p className="text-sm text-gray-700">ID: {user?.id || 'PATIENT-ID'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider">Prescribing Doctor</h4>
                    <p className="font-medium">{selectedOrder.doctorName}</p>
                    <p className="text-sm text-gray-700">Board Certified Dermatologist</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <h3 className="font-bold text-gray-900 mb-2">Treatment Information</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Medication</h4>
                      <p className="text-gray-900">{selectedOrder.medication}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Condition</h4>
                      <p className="text-gray-900">{selectedOrder.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Dosage</h4>
                      <p className="text-gray-900">{selectedOrder.dosage}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Frequency</h4>
                      <p className="text-gray-900">{selectedOrder.frequency}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-500 uppercase tracking-wider">Duration</h4>
                      <p className="text-gray-900">{selectedOrder.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Special Instructions</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200">
                  {selectedOrder.specialInstructions}
                </p>
              </div>
              
              <div className="text-sm text-gray-500 italic">
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
