
import React, { useState } from 'react';
import { FileText, FileImage } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface FileViewerProps {
  file: {
    url: string;
    type: string;
    name: string;
  };
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const getFileIcon = () => {
    if (file.type.includes('pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else if (file.type.includes('image')) {
      return <FileImage className="h-12 w-12 text-blue-500" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <FileText className="h-12 w-12 text-blue-500" />;
    } else {
      return <FileText className="h-12 w-12 text-gray-500" />;
    }
  };

  const renderFilePreview = () => {
    if (file.type.includes('image')) {
      return (
        <div className="flex justify-center">
          <img
            src={file.url}
            alt={file.name}
            className="max-h-[70vh] max-w-full object-contain"
          />
        </div>
      );
    } else if (file.type.includes('pdf') && !pdfError) {
      const pdfUrl = file.url === '#' ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : file.url;
      
      return (
        <div className="h-[70vh] w-full">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&view=FitH`}
            title={file.name}
            className="w-full h-full border-none"
            onError={() => setPdfError(true)}
          />
          <div className="mt-3 text-center">
            <Button asChild size="sm">
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
                Open in New Tab
              </a>
            </Button>
          </div>
        </div>
      );
    } else {
      // For doc/docx or other file types that can't be directly embedded
      return (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            {getFileIcon()}
          </div>
          <h3 className="text-lg font-medium mb-2">{file.name}</h3>
          <p className="text-gray-500 mb-4">
            {pdfError ? 
              "There was an error loading this PDF. Please try opening it in a new tab." : 
              "This file type cannot be previewed directly in the browser."}
          </p>
          <Button asChild>
            <a 
              href={file.url === '#' ? 
                (file.type.includes('pdf') ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : '#') : 
                file.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              download
            >
              Download File
            </a>
          </Button>
        </div>
      );
    }
  };

  return (
    <>
      <div 
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        {file.type.includes('image') ? (
          <img 
            src={file.url} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-2">
            {getFileIcon()}
            <span className="text-xs text-center truncate w-full mt-2">{file.name}</span>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[calc(90vh-8rem)]">
            {renderFilePreview()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileViewer;
