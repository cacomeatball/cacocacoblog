import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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
          options: {
            data: {
              username,
            },
          },
        });
        if (error) throw error;
        alert('Account created successfully, praise the sun!');
      }
    } catch (error: any) {
      alert(`Authentication failed!! ${error.message || error.error_description || 'Unknown error'}`);
    } finally {
      setLoading(false);
      navigate('/');
    }
  };

  return (
    <div className='login'>
      <span className='loginTitle'>
        {isLogin ? 'Login' : 'Register'}
      </span>
      <form onSubmit={handleAuth} className="loginForm">
        {isLogin ? null : <label>Username</label>}
        {isLogin ? null :
          <input
            className="blog-form-input"
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        }
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