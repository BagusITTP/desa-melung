import { useEffect, useRef, useState } from 'react';
import { Form, Button, Panel, Stack, ButtonGroup, InputGroup, Schema } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Logo_large.svg';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { ToastContainer, toast } from 'react-toastify';
import { register } from '../../../store/userSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import optionToast from '../../../constants/optionToast';
import { jwtDecode } from 'jwt-decode';

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().minLength(3, "Nama harus lebih dari 3 karakter").isRequired("Nama harus diisi"),
  email: StringType().isEmail("Email harus valid").isRequired("Email harus diisi"),
  password: StringType().isRequired("Password harus diisi"),
  phone_number: StringType().isRequired("Nomor telepon harus diisi"),
});
const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: ""
  });
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate()
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

  const handleChange = () => setVisible(!visible)

  const handleSubmit = async () => {
    // console.log(formValue, 'Form Value');

    if (formRef.current.check()) {
      setLoad(true)

      try {
        const res = await dispatch(register(formValue))
        if (res.payload.status === "success") {
          setLoad(false)
          toast.success(res.payload.message, optionToast);
          navigate('/register/verify', { state: formValue.email })
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

      <Panel bordered className='bg-white w-[250px] m-auto min-[330px]:w-[350px] sm:w-[450px] md:w-[450px] lg:w-[450px] xl:w-[450px] shadow-md' header={<h3 className="text-2xl font-bold text-center text-primary">Daftar Akun</h3>}>

        <Form
          ref={formRef}
          onChange={setFormValue}
          formValue={formValue}
          model={model}
          fluid
        >
          <Form.Group controlId="nama">
            <Form.ControlLabel>Nama Lengkap</Form.ControlLabel>
            <Form.Control
              name="name"
              errorPlacement='bottomEnd'
              placeholder="Nama Lengkap Anda"
              disabled={load}
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.ControlLabel>Email address</Form.ControlLabel>
            <Form.Control
              name="email"
              errorPlacement='bottomEnd'
              placeholder='email@gmail.com'
              disabled={load}
            />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.ControlLabel className="flex flex-col justify-center">
              <span>Password</span>
              <Form.HelpText tooltip className="!mt-0 ms-2">Password harus mengandung 1 huruf kecil, 1 huruf besar, 1 angka dan 1 simbol</Form.HelpText>
            </Form.ControlLabel>
            <InputGroup inside>
              <Form.Control
                type={visible ? 'text' : 'password'}
                errorPlacement='bottomEnd'
                name="password"
                placeholder='Masukkan password'
                autoComplete='off'
                disabled={load}
                required
              />
              <InputGroup.Button onClick={handleChange}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="phone_number">
            <Form.ControlLabel>No Telepon</Form.ControlLabel>
            <Form.Control
              name="phone_number"
              errorPlacement='bottomEnd'
              placeholder="cth. 081234567890"
              disabled={load}
            />
          </Form.Group>
          <ButtonGroup>
            <Button
              appearance="primary"
              type="submit"
              onClick={handleSubmit}
              loading={load}
            >Daftar</Button>
          </ButtonGroup>
        </Form>
        <p className="text-sm !mt-2">Sudah punya akun? <Link to="/login" className="text-sm text-primary">Masuk</Link></p>
      </Panel>
    </Stack>
  );
};

export default Index;