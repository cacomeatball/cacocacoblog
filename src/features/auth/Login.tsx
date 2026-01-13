import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Account created successfully! You can now log in.');
      }
    } catch (error: any) {
      alert(`Authentication failed: ${error.message || error.error_description || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: '#1e293b', textAlign: 'center' }}>
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>
      <form onSubmit={handleAuth} className="login-form">
        <input
          className="blog-form-input"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="blog-form-input"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn-primary" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <button
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#3b82f6', 
          cursor: 'pointer', 
          textDecoration: 'underline',
          marginTop: '1rem',
          width: '100%'
        }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
    </div>
  );
}