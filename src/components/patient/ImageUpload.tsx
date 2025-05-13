import React, { useState, useRef } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ImageUpload: React.FC = () => {
  const { state, uploadImage, goToNextStep, goToPreviousStep } = usePatient();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File too large",
        description: "Please upload an image less than 10MB.",
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
      uploadImage(fileUrl);
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
    }, 2000);
  };

  const handleRemoveImage = () => {
    uploadImage('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    if (!state.uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image to continue.",
        variant: "destructive",
      });
      return;
    }
    
    goToNextStep();
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Upload a Photo</CardTitle>
        <p className="text-center text-gray-500 mt-1">
          Please upload a clear, well-lit photo of your face
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!state.uploadedImage ? (
          <div
            className={`drop-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${isDragging ? 'bg-qskyn-50 border-qskyn-300' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-qskyn-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Drag & Drop your image here</h3>
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
        ) : (
          <div className="relative">
            <img
              src={state.uploadedImage}
              alt="Uploaded face"
              className="w-full h-auto rounded-md object-cover"
            />
            <Button 
              variant="destructive" 
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
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
          <h4 className="font-medium">Photo guidelines:</h4>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Face should be clearly visible and well-lit</li>
            <li>Avoid using filters or makeup if possible</li>
            <li>Front-facing photo is recommended</li>
            <li>Include forehead, cheeks, nose, and chin</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button 
          onClick={goToNextStep}
          disabled={!state.uploadedImage || isUploading}
          className="bg-qskyn-500 hover:bg-qskyn-600"
        >
          Continue to Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUpload;
