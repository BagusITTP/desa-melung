import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './App.css'
import Error from './pages/ErrorPage'
import Login from './pages/Auth/Login'
import AuthMiddleware from './middleware/Authmiddleware'
import Layout from './components/layout'

import Dashboard from './pages/Dashboard/Dashboard'
import PaketWisataDashboard from './pages/Dashboard/PaketWisata'
import TambahPaketWisata from './pages/Dashboard/PaketWisata/TambahPaketWisata'
import UbahPaketWisata from './pages/Dashboard/PaketWisata/UbahPaketWisata'
import TiketMasuk from './pages/Dashboard/TiketMasuk'
import Berita from './pages/Dashboard/Berita'
import TambahBerita from './pages/Dashboard/Berita/TambahBerita'
import UbahBerita from './pages/Dashboard/Berita/UbahBerita'
import Komentar from './pages/Dashboard/Komentar'
import Pesan from './pages/Dashboard/Pesan'
import PesananPaketWisata from './pages/Dashboard/Pesanan/PesananPaketWisata'
import PesananTiketMasuk from './pages/Dashboard/Pesanan/PesananTiketMasuk'

import Landing from './components/landing'
import Beranda from './pages/Beranda/Beranda'
import PaketWisata from './pages/Beranda/PaketWisata'
import Akun from './pages/Beranda/Akun'

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
          element: <PaketWisataDashboard />
        },
        {
          path: "/admin/paket-wisata/tambah",
          element: <TambahPaketWisata />
        },
        {
          path: "/admin/paket-wisata/ubah/:id",
          element: <UbahPaketWisata />
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
          path: "/admin/berita/tambah",
          element: <TambahBerita />,
        },
        {
          path: "/admin/berita/ubah/:id",
          element: <UbahBerita />,
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
        {
          path: "/admin/pesanan/tiket-masuk",
          element: <PesananTiketMasuk />,
        },
      ],
    },
    {
      path: "/",
      element: <Landing />,
      errorElement: <Error />,
      children: [
        {
          path: "/beranda",
          element: <Beranda />
        },
        {
          path: "/paket-wisata",
          element: <PaketWisata />
        },
        {
          path: "/akun",
          element: <Akun />
        },
      ]
    }
  ])

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App