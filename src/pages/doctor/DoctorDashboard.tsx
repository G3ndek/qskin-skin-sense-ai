
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Check, Search } from 'lucide-react';
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

type PrescriptionStatus = 'pending' | 'approved' | 'rejected';

interface Prescription {
  id: string;
  patientName: string;
  patientAge: number;
  imageUrl: string;
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  createdAt: Date;
  status: PrescriptionStatus;
  description: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientAge: 34,
    imageUrl: '/placeholder.svg',
    condition: 'Acne',
    severity: 'moderate',
    createdAt: new Date(2025, 4, 10),
    status: 'pending',
    description: 'Patient presents with moderate acne on cheeks and forehead. Reports using over-the-counter treatments with minimal success.',
  },
  {
    id: '2',
    patientName: 'Sarah Smith',
    patientAge: 28,
    imageUrl: '/placeholder.svg',
    condition: 'Eczema',
    severity: 'mild',
    createdAt: new Date(2025, 4, 11),
    status: 'pending',
    description: 'Mild eczema on inner elbows and behind knees. Patient reports seasonal flare-ups and dry skin.',
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    patientAge: 45,
    imageUrl: '/placeholder.svg',
    condition: 'Psoriasis',
    severity: 'severe',
    createdAt: new Date(2025, 4, 12),
    status: 'pending',
    description: 'Severe psoriasis on scalp, elbows and lower back. Patient reports increasing stress levels may be contributing to flare-up.',
  },
];

const DoctorDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const approvedCount = prescriptions.filter(p => p.status === 'approved').length;
  
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

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-qskyn-50 border-qskyn-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-qskyn-700">{pendingCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-qskyn-50 border-qskyn-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Approved Treatments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-qskyn-700">{approvedCount}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-qskyn-50 border-qskyn-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-qskyn-700">{prescriptions.length}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Prescriptions</CardTitle>
            <CardDescription>Review and approve patient prescription requests</CardDescription>
            
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Search patients or conditions..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <div 
                    key={prescription.id}
                    className="p-4 border rounded-lg bg-qskyn-50 hover:bg-qskyn-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" alt={prescription.patientName} />
                          <AvatarFallback className="bg-qskyn-200">
                            {prescription.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-medium">{prescription.patientName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Age: {prescription.patientAge}</span>
                            <span>•</span>
                            <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={prescription.severity === 'mild' ? 'outline' : 
                                       (prescription.severity === 'moderate' ? 'secondary' : 'destructive')}>
                          {prescription.severity}
                        </Badge>
                        
                        <Badge className="bg-qskyn-200 text-qskyn-800 hover:bg-qskyn-300">
                          {prescription.condition}
                        </Badge>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenPrescription(prescription)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No prescriptions match your search criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedPrescription && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                Patient Case: {selectedPrescription.patientName}
                <Badge className="ml-2 bg-qskyn-200 text-qskyn-800">{selectedPrescription.condition}</Badge>
              </DialogTitle>
              <DialogDescription>
                Review the patient information and uploaded image before approving
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Patient Information</h3>
                  <p><span className="font-medium">Name:</span> {selectedPrescription.patientName}</p>
                  <p><span className="font-medium">Age:</span> {selectedPrescription.patientAge}</p>
                  <p><span className="font-medium">Condition:</span> {selectedPrescription.condition}</p>
                  <p><span className="font-medium">Severity:</span> {selectedPrescription.severity}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedPrescription.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-1">Uploaded Image</h3>
                  <div className="aspect-square bg-qskyn-50 rounded-md overflow-hidden">
                    <img 
                      src={selectedPrescription.imageUrl} 
                      alt={`${selectedPrescription.patientName}'s condition`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">Patient Description</h3>
                <p className="text-sm bg-qskyn-50 p-3 rounded-md">{selectedPrescription.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-1">AI Analysis</h3>
                <p className="text-sm bg-qskyn-50 p-3 rounded-md">
                  Based on image analysis and patient description, this appears to be {selectedPrescription.severity} {selectedPrescription.condition}.
                  Recommended treatment would include topical medication and lifestyle adjustments.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleRejectPrescription}>
                Reject
              </Button>
              <Button onClick={handleApprovePrescription} className="bg-qskyn-600 hover:bg-qskyn-700">
                <Check className="h-4 w-4 mr-2" /> 
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
