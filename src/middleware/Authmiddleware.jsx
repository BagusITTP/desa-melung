import { Navigate } from 'react-router';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import optionToast from '../constants/optionToast';
// eslint-disable-next-line react/prop-types
const Authmiddleware = ({ children }) => {
  const cookies = new Cookies()

  const token = cookies.get('token')

  if (!(token)) {
    toast.error('Anda harus login terlebih dahulu', optionToast)
    return <Navigate to="/" />
  }

  return children

}

export default Authmiddleware