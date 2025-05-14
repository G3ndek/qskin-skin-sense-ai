
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: 'patient' | 'doctor') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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
    <div className="max-w-md w-full mx-auto bg-white dark:bg-qskyn-darkCard p-8 rounded-lg shadow-sm border dark:border-qskyn-darkBorder transition-colors">
      <h2 className="text-2xl font-semibold mb-6 text-center dark:text-qskyn-darkHeading">
        {isLogin ? 'Login to QSkin' : 'Create QSkin Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-qskyn-darkHeading">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="dark:bg-qskyn-darkInput dark:border-qskyn-darkBorder dark:text-qskyn-darkHeading dark:placeholder:text-qskyn-darkText/70"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-qskyn-darkHeading">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="dark:bg-qskyn-darkInput dark:border-qskyn-darkBorder dark:text-qskyn-darkHeading dark:placeholder:text-qskyn-darkText/70"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="dark:text-qskyn-darkHeading">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="dark:bg-qskyn-darkInput dark:border-qskyn-darkBorder dark:text-qskyn-darkHeading dark:placeholder:text-qskyn-darkText/70 pr-10"
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-qskyn-darkText focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="dark:text-qskyn-darkHeading">I am a</Label>
          <RadioGroup 
            value={formData.role} 
            onValueChange={(value) => handleRoleChange(value as 'patient' | 'doctor')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="patient" id="patient" />
              <Label htmlFor="patient" className="cursor-pointer dark:text-qskyn-darkText">Patient</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="doctor" id="doctor" />
              <Label htmlFor="doctor" className="cursor-pointer dark:text-qskyn-darkText">Doctor</Label>
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
