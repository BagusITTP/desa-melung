import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Container, Content, Header, Footer, Animation } from 'rsuite';
import { Link, Outlet, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import LogoSmall from '../../assets/Logo_small.svg';
import LogoLarge from '../../assets/Logo_large.svg';
import { MdFacebook, MdWhatsapp, MdOutlineClose } from "react-icons/md";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import optionToast from '../../constants/optionToast';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { getProfile, userSelector } from '../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Index = () => {
  const [data, setData] = useState({ role: "", name: "" });
  const location = useLocation()
  const { pathname } = location
  const cookies = new Cookies();
  const [defaultData, setDefaultData] = useState([])
  const dispatch = useDispatch()
  const user = useSelector(userSelector.selectAll)

  useEffect(() => {
    if (user.length === 0)
      dispatch(getProfile())
    else
      setDefaultData(user[0])
  }, [dispatch, user])

  useEffect(() => {
    setDefaultData(user[0] != "Tidak ada data" ? user[0] : [])
  }, [user])

  useEffect(() => {
    // let AC = dataToken?.role
    setData({ role: defaultData?.role, name: defaultData?.name })
  }, [defaultData]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const NavLink = forwardRef(function NavLink(props, ref) {
    const { href, ...rest } = props;
    return (
      <Link to={href} {...rest} ref={ref}></Link>
    );
  });

  NavLink.displayName = 'NavLink';

  const navigation = useMemo(() => {
    return [
      { name: 'Beranda', href: '/beranda', current: pathname === '/beranda' },
      { name: 'Paket Wisata', href: '/paket-wisata', current: pathname === '/paket-wisata' || pathname.match(/^\/paket-wisata\/\d+$/) },
      { name: 'Tiket Masuk', href: '/tiket-masuk', current: pathname === '/tiket-masuk' },
      { name: 'Lembaga', href: '/lembaga', current: pathname === '/lembaga' },
      { name: 'Berita', href: '/berita', current: pathname === '/berita' || pathname.match(/^\/berita\/\d+$/) },
      { name: 'Kontak', href: '/kontak', current: pathname === '/kontak' },
    ];
  }, [pathname]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

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
          <Disclosure as="nav" className={`${scrolled ? 'shadow-lg' : ''} bg-white !text-primary w-screen fixed top-0 z-10 transition-colors`}>
            {({ open, close }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 lg:px-6 xl:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 right-0 flex items-center lg:hidden">
                      {/* Mobile menu button*/}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <MdOutlineClose className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <HiOutlineBars3BottomRight className="block h-6 w-6" aria-hidden="true" />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-between">
                      <div className="flex flex-shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src={LogoSmall}
                          alt="Your Company"
                        />
                      </div>
                      <div className="hidden lg:ml-6 lg:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={classNames(
                                item.current ? 'bg-primary text-white !no-underline hover:!no-underline' : 'text-primary hover:bg-primary hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium !no-underline hover:!no-underline'
                              )}
                              aria-current={item.current ? 'page' : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                          {
                            data?.role === "user" ?
                              (
                                <>
                                  <Menu as="div" className="relative inline-block text-left">
                                    {({ open }) => (
                                      <>
                                        <Menu.Button
                                          className={`${open || pathname === '/paket-wisata/riwayat' || pathname === '/tiket-masuk/riwayat' ? 'bg-primary text-white' : 'text-primary hover:bg-primary hover:text-white'} inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                                        >
                                          <span>Riwayat</span>
                                          <BiChevronDown
                                            className={`ml-2 h-5 w-5 transition duration-150 ease-in-out`}
                                            aria-hidden="true"
                                          />
                                        </Menu.Button>
                                        <Transition
                                          as={Fragment}
                                          enter="transition ease-out duration-100"
                                          enterFrom="transform opacity-0 scale-95"
                                          enterTo="transform opacity-100 scale-100"
                                          leave="transition ease-in duration-75"
                                          leaveFrom="transform opacity-100 scale-100"
                                          leaveTo="transform opacity-0 scale-95"
                                        >
                                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                            <div className="px-1 py-1">
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <Link
                                                    key="riwayat-paket-wisata"
                                                    to="/paket-wisata/riwayat"
                                                    className={`${active ? 'bg-primary text-white' : 'bg-white'} w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 !no-underline hover:!no-underline`}
                                                  >
                                                    <div className="ml-4">
                                                      <p className="text-sm font-medium text-gray-900">
                                                        Paket Wisata
                                                      </p>
                                                    </div>
                                                  </Link>
                                                )}
                                              </Menu.Item>
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <Link
                                                    key="riwayat-tiket-masuk"
                                                    to='/tiket-masuk/riwayat'
                                                    className={`${active ? 'bg-primary text-white' : 'bg-white'} w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 !no-underline hover:!no-underline`}
                                                  >
                                                    <div className="ml-4">
                                                      <p className="text-sm font-medium text-gray-900">
                                                        Tiket Masuk
                                                      </p>
                                                    </div>
                                                  </Link>
                                                )}
                                              </Menu.Item>
                                            </div>
                                          </Menu.Items>
                                        </Transition>
                                      </>
                                    )}
                                  </Menu>
                                  <Menu as="div" className="relative inline-block text-left">
                                    {({ open }) => (
                                      <>
                                        <Menu.Button
                                          className={`${open ? 'text-white' : 'text-primary'}text-primary !border-primary border focus:border focus:!border-primary active:border active:!border-primary focus-visible:border hover:bg-primary hover:text-white rounded-md text-sm font-medium !no-underline hover:!no-underline !flex justify-center items-center w-full px-3 h-full !py-2 group'`}
                                        >
                                          <span className="font-bold">{data?.name ? data?.name.split(" ")[0] : ""}</span>
                                          <BiChevronDown
                                            className={`ml-2 h-5 w-5 transition duration-150 ease-in-out`}
                                            aria-hidden="true"
                                          />
                                        </Menu.Button>
                                        <Transition
                                          as={Fragment}
                                          enter="transition ease-out duration-100"
                                          enterFrom="transform opacity-0 scale-95"
                                          enterTo="transform opacity-100 scale-100"
                                          leave="transition ease-in duration-75"
                                          leaveFrom="transform opacity-100 scale-100"
                                          leaveTo="transform opacity-0 scale-95"
                                        >
                                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                            <div className="px-1 py-1">
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <Link
                                                    key="akun"
                                                    to="/akun"
                                                    className={` w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out !no-underline hover:!no-underline hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50`}
                                                  >
                                                    <div className="ml-4">
                                                      <p className="text-sm font-medium text-gray-900">
                                                        Pengaturan Akun
                                                      </p>
                                                    </div>
                                                  </Link>
                                                )}
                                              </Menu.Item>
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <div
                                                    key="keluar"
                                                    onClick={handleLogout}
                                                    className="w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 cursor-pointer !no-underline hover:!no-underline"
                                                  >
                                                    <div className="ml-4">
                                                      <p className="text-sm font-medium text-gray-900">
                                                        Keluar
                                                      </p>
                                                    </div>
                                                  </div>
                                                )}
                                              </Menu.Item>
                                            </div>
                                          </Menu.Items>
                                        </Transition>
                                      </>
                                    )}
                                  </Menu>
                                </>
                              )
                              :
                              <Link
                                key="login"
                                to={"/login"}
                                className={classNames('bg-primary text-white hover:bg-secondary hover:text-white',
                                  'rounded-md transition px-4 py-2 text-sm font-medium !no-underline hover:!no-underline'
                                )}
                                aria-current={'page'}
                              >
                                Masuk
                              </Link>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Disclosure.Panel className="lg:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                      {navigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as={NavLink}
                          to={item.href}
                          className={classNames(
                            item.current ? 'bg-primary text-white' : 'text-primary hover:bg-primary hover:text-white',
                            'block rounded-md px-3 py-2 text-base font-medium !no-underline hover:!no-underline'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                      {
                        data?.role === "user" ?
                          (
                            <>
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className={`${open || pathname === "/paket-wisata/riwayat" || pathname === "/tiket-masuk/riwayat" ? "bg-primary text-white" : "!text-primary bg-white hover:bg-primary hover:!text-white"} flex w-full justify-between items-center rounded-lg px-3 py-2 text-left text-base font-medium focus:outline-none focus-visible:ring focus-visible:ring-primary`}
                                    >
                                      <span>Riwayat</span>
                                      <BiChevronUp
                                        className={`${open ? 'rotate-180 transform' : ''
                                          } h-5 w-5 hover:text-white`}
                                      />
                                    </Disclosure.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Disclosure.Panel className=" text-sm text-primary">
                                        <div className="relative bg-white w-full grid grid-rows-2">
                                          <Link
                                            key="riwayat-paket-wisata"
                                            to="/paket-wisata/riwayat"
                                            className={`bg-white !text-primary w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-primary !no-underline hover:!no-underline hover:!text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50`}
                                            onClick={() => close()}
                                          >
                                            <div className="ml-4">
                                              <p className="text-sm font-medium">
                                                Paket Wisata
                                              </p>
                                            </div>
                                          </Link>
                                          <Link
                                            key="riwayat-tiket-masuk"
                                            to='/tiket-masuk/riwayat'
                                            className={`bg-white !text-primary w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-primary !no-underline hover:!no-underline hover:!text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50`}
                                            onClick={() => close()}
                                          >
                                            <div className="ml-4">
                                              <p className="text-sm font-medium">
                                                Tiket Masuk
                                              </p>
                                            </div>
                                          </Link>
                                        </div>
                                      </Disclosure.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Disclosure>
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className={`${open || pathname === "/akun" ? "!bg-primary !text-white" : "!text-primary bg-white hover:bg-primary hover:!text-white"} flex w-full justify-between items-center rounded-lg  px-3 py-2 text-left text-base font-medium hover:bg-primary hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-primary`}
                                    >
                                      <span>{data?.name ? data?.name.split(" ")[0] : ""}</span>
                                      <BiChevronUp
                                        className={`${open ? 'rotate-180 transform' : ''
                                          } h-5 w-5 hover:text-white`}
                                      />
                                    </Disclosure.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Disclosure.Panel className=" text-sm text-primary">
                                        <div className="relative bg-white w-full grid grid-rows-2">
                                          <Link
                                            key="akun"
                                            to="/akun"
                                            className={`bg-white !text-primary w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-primary !no-underline hover:!no-underline hover:!text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50`}
                                            onClick={() => close()}
                                          >
                                            <div className="ml-4">
                                              <p className="text-sm font-medium">
                                                Pengaturan Akun
                                              </p>
                                            </div>
                                          </Link>
                                          <div
                                            key="keluar"
                                            onClick={handleLogout}
                                            className={`bg-white !text-primary w-full flex gap-3 items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-primary !no-underline hover:!no-underline hover:!text-white focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 cursor-pointer`}
                                          >
                                            <div className="ml-4">
                                              <p className="text-sm font-medium">
                                                Keluar
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </Disclosure.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Disclosure>
                            </>
                          )
                          :
                          <Link
                            key="login"
                            to={"/login"}
                            className="flex w-full justify-center items-center rounded-lg bg-primary px-3 py-2 text-left text-base font-medium text-white !no-underline hover:!no-underline focus:outline-none focus-visible:ring focus-visible:ring-white"
                            aria-current={'page'}
                          >
                            Masuk
                          </Link>
                      }
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Header>
        <Content className="pt-16"><Outlet /></Content>
        <Footer>
          <Container fluid className="bg-primary h-full pb-4">
            <div className="flex flex-wrap justify-center items-center h-full w-full p-6 gap-5 sm:gap-10 md:gap-20 lg:gap-20 xl:gap-32">
              <img className='w-2/5 md:w-52 lg:w-56 xl:w-60' src={LogoLarge} alt="logo" />
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63319.95982987918!2d109.20516405!3d-7.297867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ff4c6d7690ab7%3A0x5612632581fb14a3!2sMelung%2C%20Kec.%20Kedungbanteng%2C%20Kabupaten%20Banyumas%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1705314772212!5m2!1sid!2sid" className="w-full sm:w-min h-full"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              <div className="inline-flex flex-col gap-2 text-center md:text-left text-white w-fit">
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
        <div className="fixed bottom-5 right-5">
          <Animation.Bounce in={scrolled}>
            <button
              onClick={scrollToTop}
              className="p-2 bg-green-500 text-white rounded-full">
              <BiChevronUp className="h-5 w-5" />
            </button>
          </Animation.Bounce>
        </div>
      </Container>
    </div >
  );
};

export default Index