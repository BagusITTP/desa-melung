import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

const CheckRole = ({ children }) => {
  const cookies = new Cookies()

  const token = cookies.get('token')
  const dataToken = jwtDecode(token)

  if (dataToken.role != "admin") {
    return window.location.replace('/login')
  }

  return children

}

export default CheckRole