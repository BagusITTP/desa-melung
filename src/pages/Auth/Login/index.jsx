import { useEffect, useRef, useState } from 'react';
import { Form, Button, Panel, Stack, Divider, InputGroup, Schema } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Logo_large.svg';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { ToastContainer, toast } from 'react-toastify';
import { login } from '../../../store/userSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import optionToast from '../../../constants/optionToast';

const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType().isEmail('Email required').isRequired('Email harus diisi.'),
  password: StringType().isRequired('Password harus diisi.'),
});
const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    email: "",
    password: ""
  });
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cookies = new Cookies()

  const handleChange = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      toast.info('Anda sudah login', optionToast);
      navigate('/admin/dashboard');
    }
  }, []);

  const handleSubmit = async () => {
    // console.log(formValue, 'Form Value');

    if (formRef.current.check()) {
      setLoad(true)

      try {
        const res = await dispatch(login(formValue))
        if (res.payload.status === "success") {
          let token = res.payload.data.token
          cookies.set("token", token, {
            path: "/",
            // expires: new Date(new Date().getTime() + 200 * 1000)
          });
          let role = res.payload.data.role

          toast.success(res.payload.message, optionToast);
          role === 'admin' ? navigate('/admin/dashboard') : navigate(`/${role.toLowerCase()}`)
        } else {
          setLoad(false)
          setFormValue({ ...formValue, password: "" })
          toast.error(res.payload.message, optionToast);
        }
      } catch (err) {
        setLoad(false)
        setFormValue({ ...formValue, password: "" })
        toast.error(`Terjadi kesalahan`, optionToast);
      }
    } else {
      setLoad(false)
      setFormValue({ ...formValue, password: "" })
      toast.error(`Perisa kembali email dan password anda`, optionToast);
    }
  };

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

      <Panel bordered className='bg-white w-[250px] m-auto min-[330px]:w-[350px] sm:w-[450px] md:w-[450px] lg:w-[450px] xl:w-[450px] shadow-md' header={<h3 className="text-2xl font-bold text-center text-primary">Masuk ke Akun</h3>}>

        <Form
          ref={formRef}
          onChange={setFormValue}
          formValue={formValue}
          model={model}
          fluid
        >
          <Form.Group controlId='email'>
            <Form.ControlLabel>Email address</Form.ControlLabel>
            <Form.Control name="email" placeholder='email@gmail.com' disabled={load} />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.ControlLabel>
              <span>Password</span>
              <Form.HelpText tooltip>Password harus mengandung 1 huruf kecil, 1 huruf besar, 1 angka dan 1 simbol</Form.HelpText>
            </Form.ControlLabel>
            <InputGroup inside>
              <Form.Control type={visible ? 'text' : 'password'} name="password" placeholder='Masukkan password' autoComplete='off' disabled={load} required />
              <InputGroup.Button onClick={handleChange}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Stack spacing={6} divider={<Divider vertical />}>
              <Button
                appearance="primary"
                type="submit"
                onClick={handleSubmit}
                loading={load}
              >Masuk</Button>
            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default Index;