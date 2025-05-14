
import React, { useState, useRef } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, ArrowRight, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileViewer from '@/components/shared/FileViewer';

const ImageUpload: React.FC = () => {
  const { state, uploadFile, goToNextStep, goToPreviousStep } = usePatient();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock files with actual viewable content - only images now
  const mockFiles = [
    {
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      type: 'image/jpeg',
      name: 'skin_condition.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
      type: 'image/jpeg',
      name: 'skin_condition_2.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1571868200845-4fe0658f4830',
      type: 'image/jpeg',
      name: 'skin_condition_3.jpg'
    }
  ];

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Function to capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a file from the blob
            const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
            handleFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

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
    
    if (!allowedImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image only.",
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
    
    // Check if we already have 3 photos
    const uploadedFileCount = state.uploadedFiles?.length || 0;
    if (uploadedFileCount >= 3) {
      toast({
        title: "Maximum photos reached",
        description: "You can upload a maximum of 3 photos. Please remove one to add another.",
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

  const handleRemoveFile = (index: number) => {
    if (state.uploadedFiles && state.uploadedFiles[index]) {
      const updatedFiles = [...state.uploadedFiles];
      updatedFiles.splice(index, 1);
      
      // Update the state with the new array
      uploadFile(null, updatedFiles);
    }
    
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    if (!state.uploadedFiles || state.uploadedFiles.length === 0) {
      toast({
        title: "No photo uploaded",
        description: "Please upload at least one photo to continue.",
        variant: "destructive",
      });
      return;
    }
    
    goToNextStep();
  };

  // Clean up camera when component unmounts
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Function to show mock files when no real file is uploaded
  const showMockFiles = () => {
    // If real files are uploaded, show them instead of mocks
    if (state.uploadedFiles && state.uploadedFiles.length > 0) {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Photos ({state.uploadedFiles.length}/3)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {state.uploadedFiles.map((file, index) => (
              <div key={index} className="relative">
                <div className="w-full h-[150px] bg-gray-100 rounded-md overflow-hidden">
                  <FileViewer file={file} />
                </div>
                <Button 
                  variant="destructive" 
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Otherwise show mock file examples
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Example Photos (Click to preview)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockFiles.map((file, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-md overflow-hidden h-[150px]"
              onClick={() => {
                const currentFiles = state.uploadedFiles || [];
                if (currentFiles.length < 3) {
                  uploadFile(file);
                } else {
                  toast({
                    title: "Maximum photos reached",
                    description: "You can upload a maximum of 3 photos. Please remove one to add another.",
                    variant: "destructive",
                  });
                }
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
        <CardTitle className="text-2xl text-center">Upload or Take Photos</CardTitle>
        <p className="text-center text-gray-500 mt-1">
          Please upload an image of your skin condition (max 3 photos)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isCameraActive ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`drop-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${isDragging ? 'bg-qskyn-50 border-qskyn-300' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className="h-8 w-8 text-qskyn-400 mb-2" />
                  <h3 className="text-sm font-medium mb-2">Upload Photo</h3>
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || (state.uploadedFiles && state.uploadedFiles.length >= 3)}
                    className="bg-qskyn-500 hover:bg-qskyn-600"
                  >
                    Browse Photos
                  </Button>
                </div>
              </div>

              <div
                className="camera-option border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <Camera className="h-8 w-8 text-pink-500 mb-2" />
                  <h3 className="text-sm font-medium mb-2">Take Photo</h3>
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={startCamera}
                    disabled={state.uploadedFiles && state.uploadedFiles.length >= 3}
                    className="bg-softpink-600 hover:bg-softpink-700"
                  >
                    Open Camera
                  </Button>
                </div>
              </div>
            </div>
            
            {showMockFiles()}
          </>
        ) : (
          <div className="camera-container">
            <div className="relative">
              <video 
                ref={videoRef} 
                className="w-full h-[300px] bg-black rounded-lg object-cover"
                autoPlay 
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button onClick={capturePhoto} className="bg-qskyn-500 hover:bg-qskyn-600">
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
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
            <li>Images should be clearly visible and well-lit (JPG, PNG only)</li>
            <li>Take photos in a well-lit area for best results</li>
            <li>Maximum file size: 10MB</li>
            <li>Maximum 3 photos allowed</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!state.uploadedFiles || state.uploadedFiles.length === 0 || isUploading}
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
