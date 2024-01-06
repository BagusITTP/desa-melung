import { useEffect, useState } from 'react';
import {
  Dropdown,
  Navbar,
  Nav,
  Avatar,
} from 'rsuite';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import optionToast from '../../../constants/optionToast';
import { jwtDecode } from 'jwt-decode';

const Header = ({ title }) => {
  const [dataToken, setdataToken] = useState("")

  const cookies = new Cookies()

  useEffect(() => {
    const token = cookies.get("token")
    if (token) setdataToken(jwtDecode(token))
  }, [])

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      cookies.remove("token", {
        path: "/",
        // expires: new Date(new Date().getTime() + 200 * 1000)
      });
      await toast.error("Anda telah keluar dari akun", optionToast);

      setTimeout(() => {
        window.location.replace('/')
      }, 1000);
    } catch (err) {
      await toast.error(`${err.status}`, optionToast)
    }
  }
  return (
    <Navbar className="!bg-white shadow py-1 !sticky top-0 z-10">
      <Navbar.Brand className='!text-xl font-bold'>{title}</Navbar.Brand>
      <Nav pullRight>
        <Dropdown placement='bottomEnd' icon={
          <>
            <strong>{
              dataToken.name
            }</strong>
            <Avatar
              size="sm"
              circle
              src="https://avatars.githubusercontent.com/u/1203827"
              alt="@simonguo"
              style={{ marginLeft: 8 }}
            />
          </>
        }>
          <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
            <p>Masuk sebagai</p>
            <strong>{
              dataToken.name
            }</strong>
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item>Pengaturan Akun</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Keluar</Dropdown.Item>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Header;