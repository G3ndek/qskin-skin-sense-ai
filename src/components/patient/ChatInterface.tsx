
import React, { useState, useRef, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Mic, MicOff, Play, Pause, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChatInterface: React.FC = () => {
  const { state, sendMessage } = usePatient();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Correctly type the recognitionRef to hold an instance of SpeechRecognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Function to send a text message
  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Calculate remaining messages
  const totalMessages = state.messages.length;
  const remainingMessages = Math.max(0, 6 - totalMessages);
  const showWarning = remainingMessages <= 2 && remainingMessages > 0;
  
  // Functions for voice recording
  const startRecording = () => {
    try {
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        toast({
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser.",
          variant: "destructive"
        });
        return;
      }
      
      // Use the correct constructor from window
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      // Create a new instance of the speech recognition
      const recognition = new SpeechRecognitionConstructor();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
        setIsPopoverOpen(true);
        setTranscript('');
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setMessage(prev => prev + transcript + ' ');
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(interimTranscript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setIsPopoverOpen(false);
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setIsPopoverOpen(false);
      };
      
      recognition.start();
      // Store the instance (not the constructor) in the ref
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start voice recording",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      setIsPopoverOpen(false);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-softpink-500 dark:bg-qskyn-primary text-white px-6 py-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">QSkyn AI Assistant</h2>
          <p className="text-sm text-softpink-100 dark:text-qskyn-darkHeading">
            Let's discuss your skin condition and treatment options
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {showWarning && (
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription>
              {remainingMessages === 1 
                ? "This is your last message before your session concludes."
                : `You have ${remainingMessages} messages remaining in this consultation.`}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="chat-container h-96 overflow-y-auto mb-4 p-2">
          {state.messages.length > 0 ? (
            <div className="space-y-4">
              {state.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="mr-2 flex flex-shrink-0 items-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="AI" />
                        <AvatarFallback className="bg-softpink-200 text-softpink-700 dark:bg-qskyn-primary dark:text-white">AI</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      msg.sender === 'patient'
                        ? 'bg-softpink-500 dark:bg-qskyn-primary text-white'
                        : 'bg-gray-100 dark:bg-qskyn-darkCard text-gray-800 dark:text-qskyn-darkHeading'
                    }`}
                  >
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                  
                  {msg.sender === 'patient' && (
                    <div className="ml-2 flex flex-shrink-0 items-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="You" />
                        <AvatarFallback className="bg-softpink-700 dark:bg-qskyn-secondary text-white">You</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 dark:text-qskyn-darkText">
                No messages yet. Start by sending a message to the AI assistant.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t dark:border-qskyn-darkBorder">
        <div className="flex space-x-2 w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="resize-none dark:bg-qskyn-darkInput dark:border-qskyn-darkBorder dark:text-qskyn-darkHeading dark:placeholder:text-qskyn-darkText/70"
            rows={2}
          />
          
          <div className="flex flex-col space-y-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  onClick={toggleRecording} 
                  variant="outline" 
                  size="icon"
                  className={isRecording ? "bg-red-100 text-red-600 border-red-300 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/30" : ""}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 dark:bg-qskyn-darkCard dark:border-qskyn-darkBorder" side="top">
                <div className="space-y-2">
                  <div className="font-medium text-center dark:text-qskyn-darkHeading">Voice Transcription</div>
                  <div className="bg-gray-50 dark:bg-qskyn-darkInput p-3 rounded-md min-h-[60px] text-sm dark:text-qskyn-darkText">
                    {transcript || "Listening..."}
                  </div>
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={toggleRecording}
                      size="sm"
                      className="rounded-full h-12 w-12 flex items-center justify-center"
                    >
                      {isRecording ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-center text-gray-500 dark:text-qskyn-darkText pt-1">
                    {isRecording ? "Interview ongoing" : "Hit the start when you are ready to proceed with the interview"}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button onClick={handleSendMessage} disabled={!message.trim()} type="button">
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
