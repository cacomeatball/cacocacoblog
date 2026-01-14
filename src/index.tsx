import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { Write } from './features/blog/write/Write'
import TopBar from './features/topbar/TopBar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TopBar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/write' element={<Write onPostCreated={() => {}} onCancel={() => {}} />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
