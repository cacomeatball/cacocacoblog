import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectSession, setSession } from './features/auth/authSlice';
import { supabase } from './lib/supabaseClient';
import { HashRouter, Routes, Route} from 'react-router-dom';
import './app.css';

import { Write } from './features/blog/write/Write'
import { Login } from './features/auth/Login'
import TopBar from './features/topbar/TopBar'
import Home from "./features/home/Home";
import { SinglePostPage } from './features/blog/post/SinglePostPage';

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

  if (loading) {
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <HashRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/post/:id' element={<SinglePostPage />} />
        <Route path='/write' element={session ? <Write onPostCreated={() => {}} onCancel={() => {}} /> : <Login />} />
        <Route path='/login' element={session ? <Home /> : <Login />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
