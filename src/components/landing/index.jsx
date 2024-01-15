import { forwardRef, useEffect, useRef, useState } from 'react'
import { Container, Content, Header, Navbar, Footer, Nav, Button } from 'rsuite';
import { MdHomeFilled } from "react-icons/md";
import CogIcon from '@rsuite/icons/legacy/Cog';
import { Link, Outlet, useLocation } from 'react-router-dom';
import * as AL from '../../data/index'
import 'react-toastify/dist/ReactToastify.css';
import LogoSmall from '../../assets/Logo_small.svg';
import LogoLarge from '../../assets/Logo_large.svg';
import { MdFacebook, MdWhatsapp } from "react-icons/md";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import optionToast from '../../constants/optionToast';

const Index = () => {
  const [data, setData] = useState({ role: "", name: "" });
  const headerRef = useRef()
  const location = useLocation()
  const { pathname } = location
  const [dataToken, setdataToken] = useState("")

  const cookies = new Cookies()

  useEffect(() => {
    const token = cookies.get("token")
    if (token) setdataToken(jwtDecode(token))
  }, [])

  useEffect(() => {
    // let AC = dataToken?.role
    setData({ role: dataToken?.role, name: dataToken?.name })
  }, [dataToken]);

  const NavLink = forwardRef(function NavLink(props, ref) {
    const { href, ...rest } = props;
    return (
      <Link to={href} {...rest} ref={ref}></Link>
    );
  });

  NavLink.displayName = 'NavLink';

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      cookies.remove("token", {
        path: "/",
        // expires: new Date(new Date().getTime() + 200 * 1000)
      });
      await toast.error("Anda telah keluar dari akun", optionToast);

      setTimeout(() => {
        window.location.replace('/login')
      }, 1000);
    } catch (err) {
      await toast.error(`${err.status}`, optionToast)
    }
  }
  return (
    <div className="show-fake-browser sidebar-page">
      <Container>
        <Header>
          <Navbar className="!bg-white !text-primary !h-24 px-20">
            <Navbar.Brand>
              <a style={{ color: '#fff' }}>
                <img src={LogoSmall} alt="Logo" />
              </a>
            </Navbar.Brand>
            <Nav pullRight className="!h-full flex !items-center" activeKey={pathname}>
              {
                data?.role !== "user" ?
                  (
                    <Link to="/login" className='!text-white !bg-primary hover:!bg-slate-200 hover:!text-secondary-Medium-Dark hover:!no-underline !rounded-xl !px-5 !py-3 !font-bold' appearance="default" type="submit">
                      Masuk
                    </Link>
                  )
                  :
                  (
                    <Nav.Menu
                      title={<span className="font-bold">{data?.name ? data?.name.split(" ")[0] : ""}</span>}
                      className='!text-primary !bg-white !border-primary border !rounded-xl'
                    >
                      <Nav.Item as={NavLink} eventKey='/akun/pengaturan' href='/akun'>Pengaturan Akun</Nav.Item>
                      <Nav.Item onClick={handleLogout}>Keluar</Nav.Item>
                    </Nav.Menu>
                  )
              }
            </Nav>
            <Nav pullRight className="!h-full flex !items-center" activeKey={pathname}>
              <Nav.Item icon={<MdHomeFilled />} as={NavLink} eventKey='/beranda' href='/beranda'>Beranda</Nav.Item>
              <Nav.Item as={NavLink} eventKey='/paket-wisata' href='/paket-wisata'>Paket Wisata</Nav.Item>
              <Nav.Item as={NavLink} eventKey='/tiket-masuk' href='/tiket-masuk'>Tiket Masuk</Nav.Item>
              <Nav.Item as={NavLink} eventKey='/lembaga' href='/lembaga'>Lembaga</Nav.Item>
              <Nav.Item as={NavLink} eventKey='/berita' href='/berita'>Berita</Nav.Item>
              <Nav.Item as={NavLink} eventKey='/kontak' href='/kontak'>Kontak</Nav.Item>
              {
                data?.role === "user" ?
                  (
                    <Nav.Menu title="Riwayat">
                      <Nav.Item as={NavLink} eventKey='/paket-wisata/riwayat' href='/paket-wisata/riwayat'>Paket Wisata</Nav.Item>
                      <Nav.Item as={NavLink} eventKey='/tiket-masuk/riwayat' href='/tiket-masuk/riwayat'>Tiket Masuk</Nav.Item>
                    </Nav.Menu>
                  )
                  :
                  (null)
              }
            </Nav>
          </Navbar>
        </Header>
        <Content><Outlet /></Content>
        <Footer>
          <Container fluid className="bg-primary h-72">
            <div className="flex justify-center items-center h-full w-full p-6 gap-32">
              <img src={LogoLarge} alt="logo" />
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63319.95982987918!2d109.20516405!3d-7.297867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ff4c6d7690ab7%3A0x5612632581fb14a3!2sMelung%2C%20Kec.%20Kedungbanteng%2C%20Kabupaten%20Banyumas%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1705314772212!5m2!1sid!2sid" width="400"
                height="200"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              <div className="flex flex-col text-white">
                <h5 className="mb-3">Kontak:</h5>
                <p className="flex items-center gap-3"><MdFacebook /> <p>Desa Wisata Melung</p></p>
                <p className="flex items-center gap-3"><MdWhatsapp /> <p>08564759056</p></p>
                <p className="flex items-center gap-3"><FaInstagram /> <p>pagubugan_melung</p></p>
                <p className="flex items-center gap-3"><FaXTwitter /> <p>@MelungDesa</p></p>
              </div>
            </div>
            <div className="flex justify-center items-center h-full">
              <p className="text-white">© {new Date().getFullYear()} Desa Melung</p>
            </div>
          </Container>
        </Footer>
      </Container>
    </div >
  );
};

export default Index