import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import "./login.css";

function showPassword() {
  const inp = document.getElementById('password') as HTMLInputElement | null;
  const btn = document.getElementById('toggleVisibility') as HTMLInputElement | null;

  if (inp && btn) {
    if (inp.type === 'password') {
      inp.type = 'text';
    } else {
      inp.type = 'password';
    }
  }
}

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
        alert('Account created successfully, praise the sun!');
      }
    } catch (error: any) {
      alert(`Authentication failed!! ${error.message || error.error_description || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login'>
      <span className='loginTitle'>
        {isLogin ? 'Login' : 'Register'}
      </span>
      <form onSubmit={handleAuth} className="loginForm">
        <label>Email</label>
        <input
          className="blog-form-input"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          className="blog-form-input"
          id='password'
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <input type='checkbox' id='toggleVisibility' onClick={showPassword} />
          <label htmlFor='toggleVisibility'>Show password</label>
        </div>
        <button className="loginButton" disabled={loading}>
          {loading ? 'Please wait!' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <button
        className='loginRegisterButton'
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Sign Up!' : 'Login!'}
      </button>
    </div>
  );
}