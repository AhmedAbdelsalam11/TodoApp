
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import router from './router';


function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster/>
    </>
  );
}

export default App;