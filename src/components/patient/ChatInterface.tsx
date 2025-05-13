
import React, { useState, useRef, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { state, sendMessage } = usePatient();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-qskin-500 text-white px-6 py-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">QSkin AI Assistant</h2>
          <p className="text-sm text-qskin-100">
            Let's discuss your skin condition and treatment options
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="chat-container h-96 overflow-y-auto mb-4 p-2">
          {state.messages.length > 0 ? (
            <div className="space-y-2">
              {state.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.sender === 'patient'
                      ? 'chat-message-patient'
                      : 'chat-message-ai'
                  }
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-center">
                No messages yet. Start by sending a message to the AI assistant.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex space-x-2 w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="resize-none"
            rows={2}
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()} type="button">
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
