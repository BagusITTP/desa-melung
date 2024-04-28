import { Fragment, forwardRef, useEffect, useRef, useState } from "react";
import Form from "rsuite/Form";
import Button from "rsuite/Button";
import ButtonToolbar from "rsuite/ButtonToolbar";
import Input from "rsuite/Input";
import Schema from "rsuite/Schema";
import Message from "rsuite/Message";
import { getProfile, updateUser, userSelector } from "../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"
import optionToast from "../../../constants/optionToast";
import { Transition } from "@headlessui/react";
import { Helmet } from "react-helmet";

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired("Nama harus diisi"),
  phone_number: StringType().isRequired("Nomor telepon harus diisi"),
});

const Textarea = forwardRef(function Textarea(props, ref) {
  return <Input {...props} ref={ref} as="textarea" />;
});

Textarea.displayName = 'Textarea';
const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    name: "",
    phone_number: "",
  });
  const [load, setLoad] = useState(false)
  const [notif, setNotif] = useState(false)
  const dispatch = useDispatch()
  const pathname = window.location.href
  const user = useSelector(userSelector.selectAll)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  useEffect(() => {
    setFormValue(user?.[0] != [] ? user?.[0] : { name: "", phone_number: "" })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true)
      const { name, phone_number, id } = formValue

      const res = await dispatch(updateUser({ name, phone_number, id }));

      console.log(res)

      try {
        if (res.payload.data.status === "success") {
          toast.success(res.payload.data.message, optionToast);
          setLoad(false)
          // setTimeout(() => {
          //   window.location.reload()
          // }, 500)
          setNotif(true)
          dispatch(getProfile())
        } else {
          setLoad(false)
          toast.error(res.payload.data.message, optionToast);
        }
      } catch (err) {
        setLoad(false)
        toast.error(`Terjadi kesalahan`, optionToast);
      }

    } else {
      setLoad(false)
      toast.error(`Pastikan semua data yang Anda masukkan sudah benar`, optionToast);
    }
  }

  console.log()
  return (
    <>
      <Helmet>
        <title>{`Pengaturan Akun | Desa Wisata Melung`}</title>

        <meta property="og:title" content={`Pengaturan Akun | Desa Wisata Melung`} />
        <meta property="og:url" content={pathname} />
        <meta property="og:type" content="article" />
        <meta property="article:section" content="Pengaturan Akun" />
        <link rel="canonical" href={pathname} />
      </Helmet>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Pengaturan Akun</h1>
      </div>
      <section id="form" className="flex justify-center gap-5 py-5 bg-secondary-Light">
        <div className="container">
          <div className="flex flex-col p-3 gap-5 h-full bg-white rounded-lg">
            <h6 className="text-lg font-bold">Akun Anda</h6>
            <Form
              ref={formRef}
              formValue={formValue}
              model={model}
              fluid
            >
              <Form.Group controlId="nama">
                <Form.ControlLabel>Nama Lengkap</Form.ControlLabel>
                <Form.Control
                  name="nama"
                  errorPlacement='bottomEnd'
                  placeholder="Nama Lengkap Anda"
                  disabled={load}
                  value={formValue?.name}
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      name: e
                    })
                  }}
                />
                <Form.HelpText>Nama Lengkap harus diisi</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="phone_number">
                <Form.ControlLabel>No Telepon</Form.ControlLabel>
                <Form.Control
                  name="phone_number"
                  errorPlacement='bottomEnd'
                  placeholder="cth. 081234567890"
                  disabled={load}
                  value={formValue?.phone_number}
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      phone_number: e
                    })
                  }}
                />
                <Form.HelpText>No Telepon harus diisi</Form.HelpText>
              </Form.Group>

              <Transition
                as={Fragment}
                show={notif}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Message showIcon type="success" header="Berhasil" className="mb-3">
                  Untuk pengalaman pengguna yang lebih baik, kami sarankan anda untuk login kembali.
                </Message>
              </Transition>

              <ButtonToolbar>
                <Button appearance="primary" loading={load} type="button" onClick={handleSubmit}>
                  Ubah
                </Button>
              </ButtonToolbar>
            </Form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Index