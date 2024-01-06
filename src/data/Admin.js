import { FaTicket } from "react-icons/fa6";
import DashboardIcon from '@rsuite/icons/Dashboard';
import TextImageIcon from '@rsuite/icons/TextImage';
import MediaIcon from '@rsuite/icons/Media';
import PublicOpinionIcon from '@rsuite/icons/PublicOpinion';
import MessageIcon from '@rsuite/icons/Message';
import EventDetailIcon from '@rsuite/icons/EventDetail';

const Admin = [
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: DashboardIcon,
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
    icon: TextImageIcon,
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
    icon: FaTicket,
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
    icon: MediaIcon,
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
    icon: PublicOpinionIcon,
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
    icon: MessageIcon,
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
    icon: EventDetailIcon,
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
