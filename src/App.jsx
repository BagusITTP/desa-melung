import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import Error from './pages/ErrorPage'
import Login from './pages/Auth/Login'
import Layout from './components/layout'
import AuthMiddleware from './middleware/Authmiddleware'
import Dashboard from './pages/Dashboard/Dashboard'
import PaketWisata from './pages/Dashboard/PaketWisata'
import TiketMasuk from './pages/Dashboard/TiketMasuk'
import Berita from './pages/Dashboard/Berita'
import Komentar from './pages/Dashboard/Komentar'
import Pesan from './pages/Dashboard/Pesan'
import PesananPaketWisata from './pages/Dashboard/Pesanan/PesananPaketWisata'

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
      errorElement: <Error />
    },
    {
      path: "/admin",
      element: <AuthMiddleware><Layout /></AuthMiddleware>,
      errorElement: <Error />,
      children: [
        {
          path: "/admin/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/admin/paket-wisata",
          element: <PaketWisata />
        },
        {
          path: "/admin/tiket-masuk",
          element: <TiketMasuk />,
        },
        {
          path: "/admin/berita",
          element: <Berita />,
        },
        {
          path: "/admin/komentar",
          element: <Komentar />,
        },
        {
          path: "/admin/pesan",
          element: <Pesan />,
        },
        {
          path: "/admin/pesanan/paket-wisata",
          element: <PesananPaketWisata />,
        },
      ],
    },
  ])

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App