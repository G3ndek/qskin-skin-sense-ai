
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin = false }) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'doctor',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: 'patient' | 'doctor') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password, formData.role);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role);
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }

      // Updated navigation - take users directly to their respective dashboards
      if (formData.role === 'patient') {
        navigate('/patient/dashboard');
      } else {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isLogin ? 'Login to QSkin' : 'Create QSkin Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>I am a</Label>
          <RadioGroup 
            value={formData.role} 
            onValueChange={(value) => handleRoleChange(value as 'patient' | 'doctor')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="patient" id="patient" />
              <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="doctor" id="doctor" />
              <Label htmlFor="doctor" className="cursor-pointer">Doctor</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
