import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectSession, setSession, clearSession } from './features/auth/authSlice';
import { Login } from './features/auth/Login';
import { BlogList } from './features/blog/BlogList';
import { supabase } from './lib/supabaseClient';

function App() {
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession({ user: session?.user ?? null, session }));
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession({ user: session?.user ?? null, session }));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearSession());
  };

  if (loading) {
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="App">
        <header className="blog-header">
          <h1>My Blog App</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Please log in to continue</p>
        </header>
        <div className="login-container">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="blog-header">
        <h1>My Blog App</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="welcome-message">Welcome, {session.user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>
      <main className="blog-content">
        <BlogList />
      </main>
    </div>
  );
}

export default App;
