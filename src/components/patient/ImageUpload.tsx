
import React, { useState, useRef } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ArrowRight, FileText, FileImage } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileViewer from '@/components/shared/FileViewer';

const ImageUpload: React.FC = () => {
  const { state, uploadFile, goToNextStep, goToPreviousStep } = usePatient();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock files with actual viewable content
  const mockFiles = [
    {
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      type: 'image/jpeg',
      name: 'skin_condition.jpg'
    },
    {
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'application/pdf',
      name: 'medical_history.pdf'
    },
    {
      url: 'https://images.unsplash.com/photo-1571868200845-4fe0658f4830',
      type: 'image/jpeg',
      name: 'additional_symptom.jpg'
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG image, PDF, or DOC file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File too large",
        description: "Please upload a file less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Start mock upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    // Wait for "upload" to complete before processing
    setTimeout(() => {
      uploadFile({
        url: fileUrl,
        type: file.type,
        name: file.name
      });
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
    }, 2000);
  };

  const handleRemoveFile = () => {
    uploadFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    if (!state.uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a file to continue.",
        variant: "destructive",
      });
      return;
    }
    
    goToNextStep();
  };

  // Function to show mock files when no real file is uploaded
  const showMockFiles = () => {
    // If a real file is uploaded, use that instead of mocks
    if (state.uploadedFile) {
      return (
        <div className="relative">
          <div className="w-full h-[250px] bg-gray-100 rounded-md overflow-hidden">
            <FileViewer file={state.uploadedFile} />
          </div>
          <Button 
            variant="destructive" 
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Otherwise show mock file examples
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Example Files (Click to preview)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockFiles.map((file, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-md overflow-hidden h-[150px]"
              onClick={() => {
                uploadFile(file);
              }}
            >
              <FileViewer file={file} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Upload Files</CardTitle>
        <p className="text-center text-gray-500 mt-1">
          Please upload an image, PDF, or document for your consultation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!state.uploadedFile ? (
          <>
            <div
              className={`drop-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${isDragging ? 'bg-qskyn-50 border-qskyn-300' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-12 w-12 text-qskyn-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag & Drop your file here</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Or click to browse from your device
                </p>
                <Button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-qskyn-500 hover:bg-qskyn-600"
                >
                  Browse Files
                </Button>
              </div>
            </div>
            
            {showMockFiles()}
          </>
        ) : (
          <div className="relative">
            <div className="w-full h-[250px] bg-gray-100 rounded-md overflow-hidden">
              <FileViewer file={state.uploadedFile} />
            </div>
            <Button 
              variant="destructive" 
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="bg-gray-200" />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">File guidelines:</h4>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Images should be clearly visible and well-lit (JPG, PNG)</li>
            <li>PDFs should be legible and contain relevant information</li>
            <li>Document files should be in standard format (DOC, DOCX)</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!state.uploadedFile || isUploading}
          className="bg-softpink-600 hover:bg-softpink-700 text-white font-medium shadow-md flex items-center px-6 py-2.5 text-base"
        >
          Continue to Analysis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUpload;
