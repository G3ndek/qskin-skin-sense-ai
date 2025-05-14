
import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Search, CheckCircle, Clock, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PrescriptionStatus = 'pending' | 'approved' | 'rejected';

interface Message {
  id: string;
  sender: 'patient' | 'ai';
  text: string;
  timestamp: Date;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  patientAge: number;
  images: string[];
  condition: string;
  createdAt: Date;
  status: PrescriptionStatus;
  description: string;
  conversation: Message[];
}

// Updated mock data to include multiple prescriptions per patient with varied statuses and dates
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientId: 'p1',
    patientAge: 34,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    condition: 'Acne',
    createdAt: new Date(2025, 3, 10), // April 10, 2025
    status: 'approved',
    description: 'Patient presents with moderate acne on cheeks and forehead. Reports using over-the-counter treatments with minimal success.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: new Date(2025, 3, 10, 9, 0) },
      { id: '2', sender: 'patient', text: 'I\'ve been having persistent acne on my face for several months now.', timestamp: new Date(2025, 3, 10, 9, 1) },
      { id: '3', sender: 'ai', text: 'I\'m sorry to hear that. Could you describe the acne? Where is it located and how severe is it?', timestamp: new Date(2025, 3, 10, 9, 2) },
      { id: '4', sender: 'patient', text: 'It\'s mostly on my cheeks and forehead. I get red, inflamed pimples that sometimes hurt.', timestamp: new Date(2025, 3, 10, 9, 3) },
      { id: '5', sender: 'ai', text: 'Have you tried any treatments so far?', timestamp: new Date(2025, 3, 10, 9, 4) },
      { id: '6', sender: 'patient', text: 'Yes, I\'ve tried some over-the-counter face washes and creams, but they don\'t seem to work well.', timestamp: new Date(2025, 3, 10, 9, 5) }
    ]
  },
  {
    id: '4',
    patientName: 'John Doe',
    patientId: 'p1',
    patientAge: 34,
    images: ['/placeholder.svg'],
    condition: 'Dermatitis',
    createdAt: new Date(2025, 4, 15), // May 15, 2025 (more recent)
    status: 'pending',
    description: 'Patient now presents with dermatitis on hands. May be related to new cleaning products.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello again! How can I help you today?', timestamp: new Date(2025, 4, 15, 14, 0) },
      { id: '2', sender: 'patient', text: 'I\'ve developed a new issue. My hands are very red and itchy.', timestamp: new Date(2025, 4, 15, 14, 1) },
      { id: '3', sender: 'ai', text: 'I\'m sorry to hear that. When did you first notice this?', timestamp: new Date(2025, 4, 15, 14, 2) },
      { id: '4', sender: 'patient', text: 'About a week ago. I started using a new dish soap around that time.', timestamp: new Date(2025, 4, 15, 14, 3) }
    ]
  },
  {
    id: '2',
    patientName: 'Sarah Smith',
    patientId: 'p2',
    patientAge: 28,
    images: ['/placeholder.svg', '/placeholder.svg'],
    condition: 'Eczema',
    createdAt: new Date(2025, 3, 11), // April 11, 2025
    status: 'rejected',
    description: 'Mild eczema on inner elbows and behind knees. Patient reports seasonal flare-ups and dry skin.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: new Date(2025, 3, 11, 10, 0) },
      { id: '2', sender: 'patient', text: 'I have this itchy rash that comes and goes. I think it might be eczema.', timestamp: new Date(2025, 3, 11, 10, 1) },
      { id: '3', sender: 'ai', text: 'I see. Where on your body do you experience this rash?', timestamp: new Date(2025, 3, 11, 10, 2) },
      { id: '4', sender: 'patient', text: 'It\'s mainly in the creases of my elbows and behind my knees. It gets worse when the seasons change.', timestamp: new Date(2025, 3, 11, 10, 3) }
    ]
  },
  {
    id: '5',
    patientName: 'Sarah Smith',
    patientId: 'p2',
    patientAge: 28,
    images: ['/placeholder.svg'],
    condition: 'Dermatitis',
    createdAt: new Date(2025, 4, 18), // May 18, 2025 (more recent)
    status: 'pending',
    description: 'New rash developed on face. Different from previous eczema patterns.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: new Date(2025, 4, 18, 15, 0) },
      { id: '2', sender: 'patient', text: 'I have a new rash on my face that doesn\'t look like my usual eczema.', timestamp: new Date(2025, 4, 18, 15, 1) },
      { id: '3', sender: 'ai', text: 'I see. Could you describe how it looks different?', timestamp: new Date(2025, 4, 18, 15, 2) },
      { id: '4', sender: 'patient', text: 'It\'s more red and slightly raised. It came after I tried a new face cleanser.', timestamp: new Date(2025, 4, 18, 15, 3) }
    ]
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    patientId: 'p3',
    patientAge: 45,
    images: ['/placeholder.svg'],
    condition: 'Psoriasis',
    createdAt: new Date(2025, 4, 12),
    status: 'pending',
    description: 'Severe psoriasis on scalp, elbows and lower back. Patient reports increasing stress levels may be contributing to flare-up.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: new Date(2025, 4, 12, 11, 0) },
      { id: '2', sender: 'patient', text: 'I have these painful, scaly patches on my skin that won\'t go away.', timestamp: new Date(2025, 4, 12, 11, 1) },
      { id: '3', sender: 'ai', text: 'I\'m sorry to hear that. Could you describe where these patches are located?', timestamp: new Date(2025, 4, 12, 11, 2) },
      { id: '4', sender: 'patient', text: 'They\'re on my scalp, elbows, and lower back. They\'re red, raised, and have silvery scales.', timestamp: new Date(2025, 4, 12, 11, 3) },
      { id: '5', sender: 'ai', text: 'Have you noticed any triggers that make it worse?', timestamp: new Date(2025, 4, 12, 11, 4) },
      { id: '6', sender: 'patient', text: 'Yes, it seems to get worse when I\'m stressed, which has been happening a lot lately with work.', timestamp: new Date(2025, 4, 12, 11, 5) }
    ]
  },
];

const DoctorDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] = useState<Prescription[]>([]);
  const [currentPrescriptionIndex, setCurrentPrescriptionIndex] = useState(0);
  
  // Group prescriptions by patient and sort by date
  const patientPrescriptions = useMemo(() => {
    const filteredPrescriptions = prescriptions.filter(
      p => p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.condition.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Group by patientId
    const groupedByPatient = filteredPrescriptions.reduce((acc, prescription) => {
      const patientId = prescription.patientId;
      if (!acc[patientId]) {
        acc[patientId] = [];
      }
      acc[patientId].push(prescription);
      return acc;
    }, {} as Record<string, Prescription[]>);
    
    return Object.values(groupedByPatient).map(patientPrescriptions => {
      // Sort by date (newest first)
      const sorted = [...patientPrescriptions].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      
      // Get counts by status
      const pendingCount = sorted.filter(p => p.status === 'pending').length;
      const approvedCount = sorted.filter(p => p.status === 'approved').length;
      const rejectedCount = sorted.filter(p => p.status === 'rejected').length;
      
      // Latest prescription is always the most recent one
      return {
        latestPrescription: sorted[0],
        allPrescriptions: sorted,
        pendingCount,
        approvedCount,
        rejectedCount,
        totalCount: sorted.length
      };
    });
  }, [prescriptions, searchQuery]);

  const handleOpenPatientPrescriptions = (patientPrescriptions: Prescription[]) => {
    // Sort prescriptions by date before opening dialog
    const sortedPrescriptions = [...patientPrescriptions].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    setSelectedPatientPrescriptions(sortedPrescriptions);
    setCurrentPrescriptionIndex(0);
    setSelectedPrescription(sortedPrescriptions[0]);
    setIsDialogOpen(true);
  };

  // Navigation and action handlers
  const handleNextPrescription = () => {
    if (currentPrescriptionIndex < selectedPatientPrescriptions.length - 1) {
      const newIndex = currentPrescriptionIndex + 1;
      setCurrentPrescriptionIndex(newIndex);
      setSelectedPrescription(selectedPatientPrescriptions[newIndex]);
    }
  };

  const handlePreviousPrescription = () => {
    if (currentPrescriptionIndex > 0) {
      const newIndex = currentPrescriptionIndex - 1;
      setCurrentPrescriptionIndex(newIndex);
      setSelectedPrescription(selectedPatientPrescriptions[newIndex]);
    }
  };

  const handleApprovePrescription = () => {
    if (selectedPrescription && selectedPrescription.status === 'pending') {
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === selectedPrescription.id 
            ? { ...p, status: 'approved' as PrescriptionStatus } 
            : p
        )
      );
      
      toast({
        title: "Prescription Approved",
        description: `You've approved treatment for ${selectedPrescription.patientName}`,
      });
      
      // If there are more prescriptions, go to next, otherwise close dialog
      if (currentPrescriptionIndex < selectedPatientPrescriptions.length - 1) {
        handleNextPrescription();
      } else {
        setIsDialogOpen(false);
      }
    }
  };

  const handleRejectPrescription = () => {
    if (selectedPrescription && selectedPrescription.status === 'pending') {
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === selectedPrescription.id 
            ? { ...p, status: 'rejected' as PrescriptionStatus } 
            : p
        )
      );
      
      toast({
        title: "Prescription Rejected",
        description: `You've rejected treatment for ${selectedPrescription.patientName}`,
        variant: "destructive"
      });
      
      // If there are more prescriptions, go to next, otherwise close dialog
      if (currentPrescriptionIndex < selectedPatientPrescriptions.length - 1) {
        handleNextPrescription();
      } else {
        setIsDialogOpen(false);
      }
    }
  };

  // Helper functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const getStatusBadge = (status: PrescriptionStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Prescription Review</h1>
          <p className="text-gray-500 text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <Card className="shadow-sm border-gray-200 overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-gray-900">Patient Requests</CardTitle>
                <CardDescription className="text-gray-500 mt-1">
                  Review and approve patient prescription requests
                </CardDescription>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder="Search patients..." 
                  className="pl-10 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[250px]">Patient</TableHead>
                  <TableHead>Latest Request</TableHead>
                  <TableHead>Status Overview</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientPrescriptions.length > 0 ? (
                  patientPrescriptions.map(({ latestPrescription, allPrescriptions, pendingCount, approvedCount, rejectedCount, totalCount }) => (
                    <TableRow key={latestPrescription.id} className="hover:bg-gray-50 border-t border-gray-100">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder.svg" alt={latestPrescription.patientName} />
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {latestPrescription.patientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{latestPrescription.patientName}</div>
                            <div className="text-sm text-gray-500">Age: {latestPrescription.patientAge}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(latestPrescription.status)}
                          <span className="text-sm text-gray-600">
                            {formatDate(latestPrescription.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{latestPrescription.condition}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider>
                            {pendingCount > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {pendingCount}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{pendingCount} pending requests</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {approvedCount > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                                    <CheckCheck className="h-3 w-3" />
                                    {approvedCount}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{approvedCount} approved requests</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {rejectedCount > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                                    <span>✕</span>
                                    {rejectedCount}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{rejectedCount} rejected requests</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TooltipProvider>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {totalCount} total
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenPatientPrescriptions(allPrescriptions)}
                          className="border-gray-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View History
                        </Button>
                        
                        {pendingCount > 0 && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => {
                              // Find the first pending prescription
                              const pendingPrescriptions = allPrescriptions.filter(p => p.status === 'pending');
                              if (pendingPrescriptions.length > 0) {
                                setSelectedPatientPrescriptions(allPrescriptions);
                                const pendingIndex = allPrescriptions.findIndex(p => p.id === pendingPrescriptions[0].id);
                                setCurrentPrescriptionIndex(pendingIndex);
                                setSelectedPrescription(pendingPrescriptions[0]);
                                setIsDialogOpen(true);
                              }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Review ({pendingCount})
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                      No prescriptions match your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {selectedPrescription && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2 text-gray-900">
                <span>Patient Case: {selectedPrescription.patientName}</span>
                <Badge className="bg-blue-200 text-blue-800">{selectedPrescription.condition}</Badge>
                {getStatusBadge(selectedPrescription.status)}
                {selectedPatientPrescriptions.length > 1 && (
                  <div className="ml-auto flex items-center text-sm font-normal">
                    Request {currentPrescriptionIndex + 1} of {selectedPatientPrescriptions.length}
                  </div>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {formatDate(selectedPrescription.createdAt)} - Review the patient information, interview, and uploaded images
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Patient Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-900 mb-1"><span className="font-medium">Name:</span> {selectedPrescription.patientName}</p>
                    <p className="text-gray-900 mb-1"><span className="font-medium">Age:</span> {selectedPrescription.patientAge}</p>
                    <p className="text-gray-900 mb-1"><span className="font-medium">Condition:</span> {selectedPrescription.condition}</p>
                    <p className="text-gray-900 mb-1"><span className="font-medium">Date:</span> {formatDate(selectedPrescription.createdAt)}</p>
                    <p className="text-gray-900"><span className="font-medium">Status:</span> {selectedPrescription.status}</p>
                  </div>
                  
                  {selectedPrescription.status !== 'pending' && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-700">
                        This prescription was {selectedPrescription.status} on {formatDate(selectedPrescription.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-medium text-sm text-gray-500 mb-1">
                    Uploaded Images ({Math.min(selectedPrescription.images.length, 3)})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedPrescription.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                        <AspectRatio ratio={1}>
                          <img 
                            src={image} 
                            alt={`${selectedPrescription.patientName}'s condition ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">Patient Interview</h3>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-64 overflow-y-auto">
                  {selectedPrescription.conversation.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-3 flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.sender === 'patient'
                            ? 'bg-blue-100 text-blue-800 ml-auto'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">Patient Description</h3>
                <p className="text-sm bg-gray-50 p-4 rounded-md text-gray-900 border border-gray-200">{selectedPrescription.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">AI Analysis</h3>
                <p className="text-sm bg-gray-50 p-4 rounded-md text-gray-900 border border-gray-200">
                  Based on image analysis and patient description, this appears to be {selectedPrescription.condition}.
                  Recommended treatment would include topical medication and lifestyle adjustments.
                </p>
              </div>
              
              {selectedPrescription.status !== 'pending' && (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium text-sm mb-2">
                    {selectedPrescription.status === 'approved' 
                      ? 'This prescription was approved' 
                      : 'This prescription was rejected'}
                  </h3>
                  <p className="text-sm text-gray-700">
                    Decision made on {formatDate(selectedPrescription.createdAt)}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex space-x-2">
                  {selectedPatientPrescriptions.length > 1 && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handlePreviousPrescription}
                        disabled={currentPrescriptionIndex === 0}
                        size="sm"
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleNextPrescription}
                        disabled={currentPrescriptionIndex === selectedPatientPrescriptions.length - 1}
                        size="sm"
                      >
                        Next
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {selectedPrescription.status === 'pending' ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleRejectPrescription} 
                        className="border-gray-200"
                      >
                        Reject
                      </Button>
                      <Button 
                        onClick={handleApprovePrescription} 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> 
                        Approve Prescription
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default DoctorDashboard;
