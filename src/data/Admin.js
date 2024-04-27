import { TfiTicket } from "react-icons/tfi";
import { BiBarChartSquare, BiMessageDetail, BiNews, BiReceipt, BiSpreadsheet, BiChat } from "react-icons/bi";

const Admin = [
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: BiBarChartSquare,
    header: "Dashboard",
    child: [
      {
        id: "/admin/dashboard",
        childtitle: "Dashboard",
        childlink: "/admin/dashboard"
      }
    ]
  },
  {
    id: "Paket Wisata",
    title: "Paket Wisata",
    icon: BiSpreadsheet,
    header: "Paket Wisata",
    child: [
      {
        id: "/admin/paket-wisata",
        childtitle: "Paket Wisata",
        childlink: "/admin/paket-wisata"
      }
    ]
  },
  {
    id: "Tiket Masuk",
    title: "Tiket Masuk",
    icon: TfiTicket,
    header: "Tiket Masuk",
    child: [
      {
        id: "/admin/tiket-masuk",
        childtitle: "Tiket Masuk",
        childlink: "/admin/tiket-masuk"
      }
    ]
  },
  {
    id: "Berita",
    title: "Berita",
    icon: BiNews,
    header: "Berita",
    child: [
      {
        id: "/admin/berita",
        childtitle: "Berita",
        childlink: "/admin/berita"
      }
    ]
  },
  {
    id: "Komentar",
    title: "Komentar",
    icon: BiChat,
    header: "Komentar",
    child: [
      {
        id: "/admin/komentar",
        childtitle: "Komentar",
        childlink: "/admin/komentar"
      }
    ]
  },
  {
    id: "Pesan",
    title: "Pesan",
    icon: BiMessageDetail,
    header: "Pesan",
    child: [
      {
        id: "/admin/pesan",
        childtitle: "Pesan",
        childlink: "/admin/pesan"
      }
    ]
  },
  {
    id: "Pesanan",
    title: "Pesanan",
    icon: BiReceipt,
    link: "/admin/pesanan",
    child: [
      {
        id: "/admin/pesanan/paket-wisata",
        childtitle: "Paket Wisata",
        childlink: "/admin/pesanan/paket-wisata"
      },
      {
        id: "/admin/pesanan/tiket-masuk",
        childtitle: "Tiket Masuk",
        childlink: "/admin/pesanan/tiket-masuk"
      }
    ]
  }
];

export default Admin;
