
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Search, CheckCircle, FileText } from 'lucide-react';
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
  patientAge: number;
  images: string[];
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  createdAt: Date;
  status: PrescriptionStatus;
  description: string;
  conversation: Message[];
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientAge: 34,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    condition: 'Acne',
    severity: 'moderate',
    createdAt: new Date(2025, 4, 10),
    status: 'pending',
    description: 'Patient presents with moderate acne on cheeks and forehead. Reports using over-the-counter treatments with minimal success.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: new Date(2025, 4, 10, 9, 0) },
      { id: '2', sender: 'patient', text: 'I\'ve been having persistent acne on my face for several months now.', timestamp: new Date(2025, 4, 10, 9, 1) },
      { id: '3', sender: 'ai', text: 'I\'m sorry to hear that. Could you describe the acne? Where is it located and how severe is it?', timestamp: new Date(2025, 4, 10, 9, 2) },
      { id: '4', sender: 'patient', text: 'It\'s mostly on my cheeks and forehead. I get red, inflamed pimples that sometimes hurt.', timestamp: new Date(2025, 4, 10, 9, 3) },
      { id: '5', sender: 'ai', text: 'Have you tried any treatments so far?', timestamp: new Date(2025, 4, 10, 9, 4) },
      { id: '6', sender: 'patient', text: 'Yes, I\'ve tried some over-the-counter face washes and creams, but they don\'t seem to work well.', timestamp: new Date(2025, 4, 10, 9, 5) }
    ]
  },
  {
    id: '2',
    patientName: 'Sarah Smith',
    patientAge: 28,
    images: ['/placeholder.svg', '/placeholder.svg'],
    condition: 'Eczema',
    severity: 'mild',
    createdAt: new Date(2025, 4, 11),
    status: 'pending',
    description: 'Mild eczema on inner elbows and behind knees. Patient reports seasonal flare-ups and dry skin.',
    conversation: [
      { id: '1', sender: 'ai', text: 'Hello! How can I help you today?', timestamp: new Date(2025, 4, 11, 10, 0) },
      { id: '2', sender: 'patient', text: 'I have this itchy rash that comes and goes. I think it might be eczema.', timestamp: new Date(2025, 4, 11, 10, 1) },
      { id: '3', sender: 'ai', text: 'I see. Where on your body do you experience this rash?', timestamp: new Date(2025, 4, 11, 10, 2) },
      { id: '4', sender: 'patient', text: 'It\'s mainly in the creases of my elbows and behind my knees. It gets worse when the seasons change.', timestamp: new Date(2025, 4, 11, 10, 3) }
    ]
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    patientAge: 45,
    images: ['/placeholder.svg'],
    condition: 'Psoriasis',
    severity: 'severe',
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
  
  const filteredPrescriptions = prescriptions.filter(
    p => p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleApprovePrescription = () => {
    if (selectedPrescription) {
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
      
      setIsDialogOpen(false);
    }
  };

  const handleRejectPrescription = () => {
    if (selectedPrescription) {
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
      
      setIsDialogOpen(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id} className="hover:bg-gray-50 border-t border-gray-100">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder.svg" alt={prescription.patientName} />
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {prescription.patientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{prescription.patientName}</div>
                            <div className="text-sm text-gray-500">Age: {prescription.patientAge}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {prescription.status === 'pending' ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
                        ) : prescription.status === 'approved' ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenPrescription(prescription)}
                          className="border-gray-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {prescription.status === 'pending' && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => {
                              setSelectedPrescription(prescription);
                              handleApprovePrescription();
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
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
              <DialogTitle className="flex items-center text-gray-900">
                Patient Case: {selectedPrescription.patientName}
                <Badge className="ml-2 bg-blue-200 text-blue-800">{selectedPrescription.condition}</Badge>
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Review the patient information, interview, and uploaded images before making a decision
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
                    <p className="text-gray-900 mb-1"><span className="font-medium">Severity:</span> {selectedPrescription.severity}</p>
                    <p className="text-gray-900"><span className="font-medium">Date:</span> {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Uploaded Images ({selectedPrescription.images.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedPrescription.images.map((image, index) => (
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
                          {formatTime(new Date(message.timestamp))}
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
                  Based on image analysis and patient description, this appears to be {selectedPrescription.severity} {selectedPrescription.condition}.
                  Recommended treatment would include topical medication and lifestyle adjustments.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleRejectPrescription} className="border-gray-200">
                Reject
              </Button>
              <Button onClick={handleApprovePrescription} className="bg-blue-500 hover:bg-blue-600 text-white">
                <CheckCircle className="h-4 w-4 mr-2" /> 
                Approve Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default DoctorDashboard;
