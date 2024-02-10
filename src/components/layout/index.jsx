import { forwardRef, useEffect, useRef, useState } from 'react'
import { Container, Sidebar, Sidenav, Content, Navbar, Nav, DOMHelper } from 'rsuite';
import Header from './Header'
import { Icon } from '@rsuite/icons';
import AngleLeftIcon from '@rsuite/icons/legacy/AngleLeft';
import AngleRightIcon from '@rsuite/icons/legacy/AngleRight';
import { Link, Outlet, useLocation } from 'react-router-dom';
import * as AL from '../../data/index'
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../assets/Logo_medium.svg';
import "./styles.css"
import titleMap from '../../constants/titleMap';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

const sideBarStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  position: 'fixed',
  zIndex: 100,
  scrollbarWidth: 'none',
}

const NavToggle = ({ expand, onChange }) => {
  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          {expand ? <AngleLeftIcon /> : <AngleRightIcon />}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

const NavLink = forwardRef(function NavLink(props, ref) {
  const { href, ...rest } = props;
  return (
    <Link to={href} {...rest} ref={ref}></Link>
  );
});

NavLink.displayName = 'NavLink';

const { getWidth } = DOMHelper

const Index = () => {
  const [expand, setExpand] = useState(true);
  const [data, setData] = useState([]);
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
    let AC = "admin";
    for (const key of Object.keys(AL)) {
      if (AC?.toLowerCase() === key.toLowerCase()) {
        setData(AL[key]);
      }
    }
  }, [dataToken]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 1100) {
      setExpand(false);
    } else {
      setExpand(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (getWidth(headerRef.current) < 1100) {
      setExpand(false)
    } else {
      setExpand(true)
    }
  }, [])

  const path2 = pathname.split("/")[2];
  const path3 = pathname.split("/")[3];

  const getTitle = () => {
    if (path2 === "paket-wisata") {
      return path3 === "ubah" ? "Ubah Paket Wisata" : titleMap[pathname];
    } else if (path2 === "berita") {
      return path3 === "ubah" ? "Ubah Berita" : titleMap[pathname];
    } else {
      return titleMap[pathname];
    }
  };

  const getPath = () => {
    if (path2 === "paket-wisata") return "/admin/paket-wisata"
    else if (path2 === "berita") return "/admin/berita"
    else return pathname
  };

  return (
    <div className="show-fake-browser sidebar-page">
      <Container className='frame'>
        <Sidebar
          style={sideBarStyles}
          width={expand ? 240 : 56}
          collapsible
        >
          <Sidenav.Header>
            <div className={`flex justify-center w-full ${expand ? "p-4" : "p-7"}`}>
              <img src={Logo} className={`object-cover w-40 ${expand ? "block" : "hidden"}`} />
            </div>
          </Sidenav.Header>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={[`/${pathname.split("/")[1]}/${pathname.split("/")[2]}`]}
            appearance="subtle"
            className={`${expand ? "overflow-auto" : ""}`}
          >
            <Sidenav.Body className={`${expand ? "flex flex-col items-center" : ""}`}>
              <Nav
                activeKey={getPath()}
                className={`${expand ? "w-52" : ""}`}
              >
                {data.map((data, i) => {
                  let { title, icon, link, child } = data
                  return (
                    <>
                      {
                        data.header
                          ?
                          <>
                            {child.map((child, index) => {
                              return (
                                <>
                                  <Nav.Item
                                    as={NavLink}
                                    href={child.childlink}
                                    eventKey={child.id}
                                    title={child.childtitle}
                                    icon={<Icon as={icon} />}
                                    key={index}
                                  >{child.childtitle}</Nav.Item>
                                </>
                              )
                            })}
                          </>
                          :
                          <Nav.Menu
                            eventKey={link}
                            trigger="hover"
                            title={title}
                            icon={<Icon as={icon} />}
                            placement="rightStart"
                            key={i}
                          >
                            {child.map((childs, key) => {
                              return (
                                <>
                                  <Nav.Item as={NavLink} href={childs.childlink} eventKey={childs.id} key={key}
                                  >{childs.childtitle}</Nav.Item>
                                </>
                              )
                            })}
                          </Nav.Menu>
                      }
                    </>
                  )
                })}
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </Sidebar>

        <Container ref={headerRef} className={`bg-neutral-100 ${expand ? 'pl-60' : 'pl-14'} !h-fit !min-h-full`}>
          <Header title={getTitle()} />
          <Content className='m-5 bg-white rounded-md !h-fit !min-h-full shadow-lg'>
            <Outlet />
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Index