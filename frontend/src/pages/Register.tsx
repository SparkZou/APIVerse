import React, { useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { LogoIcon } from '../components/Logo';
import { useToast } from '../components/ToastProvider';

const Register = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { showToast } = useToast();
  const isLogin = location.pathname === '/login';
  const plan = searchParams.get('plan') || 'standard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Login Logic
        const response = await fetch('http://localhost:8000/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            company_name: "unknown" // Not needed for login but schema might require it if strict
          }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showToast('Successfully signed in! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);

      } else {
        // Registration Logic
        // 1. Create User
        const userResponse = await fetch('http://localhost:8000/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            company_name: formData.company
          }),
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.detail || 'Registration failed');
        }

        const userData = await userResponse.json();

        // 2. Create Subscription
        const subResponse = await fetch(`http://localhost:8000/subscriptions/${userData.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan_type: plan
          }),
        });

        if (!subResponse.ok) {
          console.error('Subscription creation failed');
        }

        // 3. Auto-login after registration to get real JWT token
        const loginResponse = await fetch('http://localhost:8000/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            company_name: formData.company
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify(loginData.user));
        } else {
          // Fallback: store user data without token (user will need to login)
          localStorage.setItem('user', JSON.stringify(userData));
        }

        showToast('Account created successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }

    } catch (error: any) {
      console.error('Error:', error);
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <LogoIcon size={64} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin ? (
              <>
                Or <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400">create a new account</Link>
              </>
            ) : (
              <>
                Or <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">sign in to your existing account</Link>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-500 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-500 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-500 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-slate-400">Selected Plan: </span>
                <span className="font-semibold text-blue-400 capitalize">{plan}</span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
