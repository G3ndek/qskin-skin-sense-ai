import React, { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Package, FileCheck, Clock, X, Download } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import FileViewer from '@/components/shared/FileViewer';

type OrderStatus = 'Approved' | 'Pending' | 'Rejected';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  description: string;
  status: OrderStatus;
  files?: {
    name: string;
    url: string;
    type: string;
  }[];
  conversation?: { sender: string; message: string; timestamp: Date }[];
  medication?: string;
  condition?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  specialInstructions?: string;
  doctorName?: string;
  doctorTitle?: string;
  patientName?: string;
  patientId?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicCity?: string;
  clinicPostcode?: string;
}

// Updated mock data with prescription details
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'QSK-2048',
    date: new Date(2025, 4, 14), // May 14, 2025
    description: 'Tretinoin 0.05% - Apply once daily to affected areas before bedtime',
    status: 'Approved',
    files: [
      { name: 'medical_history.pdf', url: '#', type: 'application/pdf' },
      { name: 'skin_photo_front.jpg', url: '#', type: 'image/jpeg' },
      { name: 'skin_photo_side.jpg', url: '#', type: 'image/jpeg' }
    ],
    conversation: [
      { sender: 'Patient', message: "I've been experiencing acne breakouts on my forehead and cheeks.", timestamp: new Date(2025, 4, 12) },
      { sender: 'Doctor', message: "Based on your photos, I recommend tretinoin treatment. Start with applying every other night for the first two weeks.", timestamp: new Date(2025, 4, 13) },
      { sender: 'Patient', message: "Should I expect any side effects?", timestamp: new Date(2025, 4, 13) },
      { sender: 'Doctor', message: "Some dryness and mild irritation is normal. Use a gentle moisturizer and sunscreen daily.", timestamp: new Date(2025, 4, 13) }
    ],
    medication: 'Tretinoin 0.05%',
    condition: 'Acne treatment kit',
    dosage: 'Apply pea-sized amount',
    frequency: 'Once daily at bedtime',
    duration: '12 weeks',
    specialInstructions: 'Avoid sun exposure. Use sunscreen daily. May cause dryness and peeling initially.',
    doctorName: 'Dr. Sarah Johnson',
    doctorTitle: 'Board Certified Dermatologist',
    patientName: 'John Doe',
    patientId: '1',
    clinicName: 'QSkyn Dermatology',
    clinicAddress: '123 Main Street, Suite 500',
    clinicCity: 'New York',
    clinicPostcode: 'NY 10001'
  },
  {
    id: '2',
    orderNumber: 'QSK-2035',
    date: new Date(2025, 4, 2), // May 2, 2025
    description: 'Tretinoin 0.025% - Apply a pea-sized amount to face nightly',
    status: 'Pending',
    files: [
      { name: 'patient_form.pdf', url: '#', type: 'application/pdf' },
      { name: 'facial_photo.jpg', url: '#', type: 'image/jpeg' }
    ],
    conversation: [
      { sender: 'Patient', message: "I'd like to start a treatment for fine lines and wrinkles.", timestamp: new Date(2025, 4, 1) },
      { sender: 'Doctor', message: "I'll review your photos today and get back to you with a recommendation.", timestamp: new Date(2025, 4, 1) }
    ]
  },
  {
    id: '3',
    orderNumber: 'QSK-1982',
    date: new Date(2025, 3, 18), // April 18, 2025
    description: 'Tretinoin 0.1% - Apply to affected areas every evening',
    status: 'Rejected',
    files: [
      { name: 'medical_history.pdf', url: '#', type: 'application/pdf' },
      { name: 'allergy_list.pdf', url: '#', type: 'application/pdf' }, 
      { name: 'skin_condition.jpg', url: '#', type: 'image/jpeg' }
    ],
    conversation: [
      { sender: 'Patient', message: "I need stronger treatment for persistent acne.", timestamp: new Date(2025, 3, 16) },
      { sender: 'Doctor', message: "Based on your allergies and current medications, tretinoin may not be suitable. I recommend a consultation with an in-person dermatologist.", timestamp: new Date(2025, 3, 18) }
    ]
  },
  {
    id: '4',
    orderNumber: 'QSK-1845',
    date: new Date(2025, 2, 5), // March 5, 2025
    description: 'Tretinoin 0.05% - Apply thinly to face every night after cleansing',
    status: 'Approved',
    files: [
      { name: 'intake_form.pdf', url: '#', type: 'application/pdf' },
      { name: 'face_photo.jpg', url: '#', type: 'image/jpeg' }
    ],
    conversation: [
      { sender: 'Patient', message: "Looking for anti-aging treatment recommendations.", timestamp: new Date(2025, 2, 3) },
      { sender: 'Doctor', message: "Tretinoin would be appropriate for your concerns. Start with 0.05% concentration.", timestamp: new Date(2025, 2, 5) },
      { sender: 'Patient', message: "Thank you! Should I apply it in the morning or evening?", timestamp: new Date(2025, 2, 5) },
      { sender: 'Doctor', message: "Apply in the evening as it can make your skin sensitive to sunlight. Always use sunscreen during the day.", timestamp: new Date(2025, 2, 5) }
    ]
  },
];

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'Approved':
      return <FileCheck className="h-4 w-4" />;
    case 'Pending':
      return <Clock className="h-4 w-4" />;
    case 'Rejected':
      return <X className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MyOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleViewPrescription = (order: Order) => {
    setSelectedOrder(order);
    setIsPrescriptionOpen(true);
  };

  const handleDownloadPrescription = (orderId: string) => {
    // In a real app, this would generate a PDF for download
    toast({
      title: "Download started",
      description: `Prescription #${orderId} is downloading`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Prescriptions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-3xl font-bold mt-4 mb-2">My Prescriptions</h1>
          <p className="text-gray-600 mb-6">
            You can view the status of all your previous and current prescriptions here.
          </p>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4" style={{
              borderLeftColor: order.status === 'Approved' ? '#10b981' : 
                              order.status === 'Pending' ? '#f59e0b' : 
                              '#ef4444'
            }}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          Prescription #{order.orderNumber}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {format(order.date, 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border-0 flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4">{order.description}</p>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewPrescription(order)}
                    >
                      View Prescription
                    </Button>
                    <Button onClick={() => handleViewDetails(order)} variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Prescription Dialog */}
        <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Prescription #{selectedOrder?.orderNumber}</DialogTitle>
              <p className="text-muted-foreground">Issued on {selectedOrder?.date ? format(selectedOrder.date, 'MMMM d, yyyy') : ''}</p>
            </DialogHeader>
            
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedOrder?.clinicName}</h3>
                  <p className="text-gray-600">{selectedOrder?.clinicAddress}</p>
                  <p className="text-gray-600">{selectedOrder?.clinicCity}, {selectedOrder?.clinicPostcode}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm text-gray-500 uppercase mb-1">PATIENT</h4>
                  <p className="font-semibold text-lg">{selectedOrder?.patientName}</p>
                  <p className="text-gray-600">ID: {selectedOrder?.patientId}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 uppercase mb-1">PRESCRIBING DOCTOR</h4>
                  <p className="font-semibold text-lg">{selectedOrder?.doctorName}</p>
                  <p className="text-gray-600">{selectedOrder?.doctorTitle}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-xl mb-4">Treatment Information</h3>
                
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase mb-1">MEDICATION</h4>
                    <p className="font-semibold">{selectedOrder?.medication}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase mb-1">CONDITION</h4>
                    <p className="font-semibold">{selectedOrder?.condition}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase mb-1">DOSAGE</h4>
                    <p className="font-semibold">{selectedOrder?.dosage}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase mb-1">FREQUENCY</h4>
                    <p className="font-semibold">{selectedOrder?.frequency}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <h4 className="text-sm text-gray-500 uppercase mb-1">DURATION</h4>
                    <p className="font-semibold">{selectedOrder?.duration}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500 uppercase mb-2">SPECIAL INSTRUCTIONS</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p>{selectedOrder?.specialInstructions}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 italic">
                This prescription was issued digitally through QSkyn's telemedicine platform. 
                If you have any questions or concerns, please contact your prescribing doctor.
              </p>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPrescriptionOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => selectedOrder && handleDownloadPrescription(selectedOrder.orderNumber)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Prescription
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription #{selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="files">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="files">Uploaded Files</TabsTrigger>
                <TabsTrigger value="conversation">Conversation History</TabsTrigger>
              </TabsList>
              <TabsContent value="files" className="space-y-4 mt-4">
                {selectedOrder?.files && selectedOrder.files.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedOrder.files.map((file, index) => (
                      <div key={index} className="border rounded-md overflow-hidden h-32">
                        <FileViewer file={file} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No files uploaded for this prescription.</p>
                )}
              </TabsContent>
              <TabsContent value="conversation" className="mt-4">
                {selectedOrder?.conversation && selectedOrder.conversation.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.conversation.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${msg.sender === 'Patient' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium">{msg.sender}</p>
                          <p className="text-xs text-gray-500">
                            {format(msg.timestamp, 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No conversation history available.</p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default MyOrders;
