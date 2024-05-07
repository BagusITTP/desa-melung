import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Placeholder from 'rsuite/Placeholder';
import { Suspense, lazy } from 'react'
import './App.css'
import Error from './pages/ErrorPage'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Otp from './pages/Auth/Register/Otp'
import AuthMiddleware from './middleware/Authmiddleware'
import CheckRole from './middleware/CheckRole'
import Layout from './components/layout'

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const PaketWisataDashboard = lazy(() => import('./pages/Dashboard/PaketWisata'));
const TambahPaketWisata = lazy(() => import('./pages/Dashboard/PaketWisata/TambahPaketWisata'));
const UbahPaketWisata = lazy(() => import('./pages/Dashboard/PaketWisata/UbahPaketWisata'));
const TiketMasukDashboard = lazy(() => import('./pages/Dashboard/TiketMasuk'));
const BeritaDashboard = lazy(() => import('./pages/Dashboard/Berita'));
const TambahBerita = lazy(() => import('./pages/Dashboard/Berita/TambahBerita'));
const UbahBerita = lazy(() => import('./pages/Dashboard/Berita/UbahBerita'));
const Komentar = lazy(() => import('./pages/Dashboard/Komentar'));
const Pesan = lazy(() => import('./pages/Dashboard/Pesan'));
const PesananPaketWisata = lazy(() => import('./pages/Dashboard/Pesanan/PesananPaketWisata'));
const PesananTiketMasuk = lazy(() => import('./pages/Dashboard/Pesanan/PesananTiketMasuk'));

import Landing from './components/landing'
// import Beranda from './pages/Beranda/Beranda'
const Beranda = lazy(() => import('./pages/Beranda/Beranda'))
const PaketWisata = lazy(() => import('./pages/Beranda/PaketWisata'))
const DetailPaketWisata = lazy(() => import('./pages/Beranda/PaketWisata/DetailPaketWisata'))
const TiketMasuk = lazy(() => import('./pages/Beranda/TiketMasuk'))
const Lembaga = lazy(() => import('./pages/Beranda/Lembaga'))
const Berita = lazy(() => import('./pages/Beranda/Berita'))
const DetailBerita = lazy(() => import('./pages/Beranda/Berita/DetailBerita'))
const Kontak = lazy(() => import('./pages/Beranda/Kontak'))
const RiwayatPaketWisata = lazy(() => import('./pages/Beranda/Riwayat/PaketWisata'))
const RiwayatTiketMasuk = lazy(() => import('./pages/Beranda/Riwayat/TiketMasuk'))
const Akun = lazy(() => import('./pages/Beranda/Akun'))
const Invoice = lazy(() => import('./pages/Invoice'))

import Editor from './pages/Editor/'

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
      errorElement: <Error />
    },
    {
      path: '/register',
      element: <Register />,
      errorElement: <Error />
    },
    {
      path: '/register/verify',
      element: <Otp />,
      errorElement: <Error />
    },
    {
      path: '/editor',
      element: <Editor />,
      errorElement: <Error />
    },
    {
      path: "/admin",
      element: <AuthMiddleware><CheckRole><Layout /></CheckRole></AuthMiddleware>,
      errorElement: <Error />,
      children: [
        {
          path: "/admin/dashboard",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "/admin/paket-wisata",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <PaketWisataDashboard />
            </Suspense>
          ),
        },
        {
          path: "/admin/paket-wisata/tambah",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <TambahPaketWisata />
            </Suspense>
          ),
        },
        {
          path: "/admin/paket-wisata/ubah/:id",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <UbahPaketWisata />
            </Suspense>
          ),
        },
        {
          path: "/admin/tiket-masuk",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <TiketMasukDashboard />
            </Suspense>
          ),
        },
        {
          path: "/admin/berita",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <BeritaDashboard />
            </Suspense>
          ),
        },
        {
          path: "/admin/berita/tambah",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <TambahBerita />
            </Suspense>
          )
        },
        {
          path: "/admin/berita/ubah/:id",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <UbahBerita />
            </Suspense>
          )
        },
        {
          path: "/admin/komentar",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <Komentar />
            </Suspense>
          )
        },
        {
          path: "/admin/pesan",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <Pesan />
            </Suspense>
          )
        },
        {
          path: "/admin/pesanan/paket-wisata",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <PesananPaketWisata />
            </Suspense>
          )
        },
        {
          path: "/admin/pesanan/tiket-masuk",
          element: (
            <Suspense fallback={<Placeholder rows={21} columns={21} active />}>
              <PesananTiketMasuk />
            </Suspense>
          )
        },
      ],
    },
    {
      path: "/",
      element: <Landing />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><Beranda /></Suspense>
        },
        {
          path: "/paket-wisata",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><PaketWisata /></Suspense>
        },
        {
          path: "/paket-wisata/:id",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><DetailPaketWisata /></Suspense>
        },
        {
          path: "/tiket-masuk",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><TiketMasuk /></Suspense>
        },
        {
          path: "/lembaga",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><Lembaga /></Suspense>
        },
        {
          path: "/berita",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><Berita /></Suspense>
        },
        {
          path: "/berita/:id",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><DetailBerita /></Suspense>
        },
        {
          path: "/kontak",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><Kontak /></Suspense>
        },
        {
          path: "/paket-wisata/riwayat",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><RiwayatPaketWisata /></Suspense>
        },
        {
          path: "/tiket-masuk/riwayat",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><RiwayatTiketMasuk /></Suspense>
        },
        {
          path: "/akun",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><Akun /></Suspense>
        },
        {
          path: "/invoice",
          element: <Suspense fallback={<Placeholder rows={21} columns={21} active />}><Invoice /></Suspense>
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