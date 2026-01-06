import { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// User credentials database
const USERS = [
  { email: 'admin@travelcrm.com', password: 'admin123', name: 'Admin User', role: 'admin' as const, isAdmin: true },
  { email: 'madhu@travelcrm.com', password: 'manager123', name: 'Madhu Chaudhary', role: 'manager' as const, isAdmin: false },
  { email: 'ujjwal@travelcrm.com', password: 'manager123', name: 'Ujjwal', role: 'manager' as const, isAdmin: false },
  { email: 'ketan@travelcrm.com', password: 'manager123', name: 'Ketan Gupta', role: 'manager' as const, isAdmin: false },
  { email: 'jitendra@travelcrm.com', password: 'manager123', name: 'Jitendra Yadav', role: 'manager' as const, isAdmin: false }
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        onLogin({
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
          email: user.email
        });
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: 'Madhu Chaudhary',
        role: 'admin',
        isAdmin: true
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TC
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">Tour Operations CRM</h1>
          <p className="text-purple-200">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>Admin: admin@travelcrm.com / admin123</p>
              <p>Manager: madhu@travelcrm.com / manager123</p>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className="w-full mt-4 border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Sign in with Microsoft Outlook
            </Button>
          </div>
        </div>

        <p className="text-center text-purple-200 text-sm mt-6">
          © 2025 Tour Operations CRM. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
