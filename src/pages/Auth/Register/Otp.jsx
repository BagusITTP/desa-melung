import { useEffect, useState } from 'react';
import { Panel, Stack, ButtonGroup, Button } from 'rsuite';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from '../../../assets/Logo_large.svg';
import { ToastContainer, toast } from 'react-toastify';
import { otp, verify } from '../../../store/userSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import optionToast from '../../../constants/optionToast';
import { jwtDecode } from 'jwt-decode';
import PinInput from 'react-pin-input';

const Otp = () => {
  const [formValue, setFormValue] = useState({
    otp: ""
  });
  const [load, setLoad] = useState(false);
  const [loadOtp, setLoadOtp] = useState(false);
  const [disable, setDisable] = useState(true);
  const [seconds, setSeconds] = useState(60);
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const cookies = new Cookies()

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      const dataToken = jwtDecode(token)
      toast.info('Anda sudah login', optionToast);
      navigate(dataToken.role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, []);

  useEffect(() => {
    if (location?.state === null) {
      navigate('/register')
      toast.error('Anda harus daftar terlebih dahulu', optionToast);
    }
    if (location?.state) {
      setEmail(location.state)
    }
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds, location, navigate]);

  const handleSubmit = async () => {
    setLoad(true)

    try {
      const res = await dispatch(verify({ email, otp: formValue.otp }));
      if (res.payload.status === "success") {
        setLoad(false)
        toast.success(res.payload.message, optionToast);
        navigate(`/login`)
      } else {
        setLoad(false)
        toast.error(res.payload.message, optionToast);
      }
    } catch (err) {
      setLoad(false)
      toast.error(`Terjadi kesalahan`, optionToast);
    }
  };

  const resendOTP = async () => {
    setLoadOtp(true)
    try {
      const res = await dispatch(otp({ email }));
      if (res.payload.status === "success") {
        setLoadOtp(false)
        toast.success(res.payload.message, optionToast);
        window.location.reload();
      } else {
        setLoadOtp(false)
        toast.error(res.payload.message, optionToast);
      }
    } catch (err) {
      setLoadOtp(false)
      toast.error(`Terjadi kesalahan`, optionToast);
    }
  }

  function maskEmail(email) {
    return email.replace(/(.{3})(.*)(?=@)/, function (_, g1, g2) {
      return g1 + '*'.repeat(g2.length);
    });
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh'
      }}
    >
      <ToastContainer />
      <div className="mb-4">
        <img src={Logo} className='object-cover w-52' />
      </div>

      <Panel bordered className='bg-white w-[250px] m-auto min-[330px]:w-[350px] sm:w-[450px] md:w-[450px] lg:w-[450px] xl:w-[450px] shadow-md' header={<h3 className="text-2xl font-bold text-center text-primary">Masukkan Kode OTP</h3>}>

        <div className="w-full flex flex-col items-center">
          <p className="text-center text-sm">
            Kami telah mengirimkan kode OTP ke email anda {maskEmail(email)}.
            <Link to="/register" className='text-primary ms-2'>Ubah email</Link>
          </p>
          <PinInput
            length={6}
            initialValue=""
            secret
            secretDelay={100}
            type="numeric"
            inputMode="number"
            style={{ paddingTop: '40px', paddingBottom: '24px' }}
            inputStyle={{ border: '1px solid #8A8A8A', borderRadius: '12px', margin: '0 2px' }}
            inputFocusStyle={{ border: '1px solid #258752' }}
            onComplete={(value) => {
              setDisable(false)
              setFormValue({ ...formValue, otp: value })
            }}
            autoSelect={true}
            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
          />

          {seconds > 0 ? (
            <p className='text-center text-sm'>
              Kirim ulang OTP dalam {seconds < 10 ? `${seconds}` : seconds} detik
            </p>
          ) : (
            <div className='text-center text-sm flex items-center'>
              <p>Tidak menerima kode otp?</p>
              <ButtonGroup>
                <Button
                  appearance="link"
                  className="!text-primary"
                  onClick={resendOTP}
                  loading={loadOtp}
                >Kirim OTP</Button>
              </ButtonGroup>
            </div>
          )}

          <ButtonGroup>
            <Button
              className="mt-3"
              appearance="primary"
              onClick={handleSubmit}
              loading={load}
              disabled={disable}
            >Verifikasi Otp</Button>
          </ButtonGroup>
        </div>
      </Panel>
    </Stack>
  );
};

export default Otp;