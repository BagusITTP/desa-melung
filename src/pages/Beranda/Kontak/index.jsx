import { forwardRef, useEffect, useRef, useState } from "react";
import Form from "rsuite/Form";
import Button from "rsuite/Button";
import ButtonToolbar from "rsuite/ButtonToolbar";
import Input from "rsuite/Input";
import Schema from "rsuite/Schema";
import Message from "rsuite/Message";
import SelectPicker from "rsuite/SelectPicker";
import Uploader from "rsuite/Uploader";
import { setContact } from "../../../store/contactSlice";
import optionToast from "../../../constants/optionToast";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import Modal from "../../../components/Modal";

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired("Nama harus diisi"),
  email: StringType().isRequired("Email harus diisi"),
  phone_number: StringType().isRequired("Nomor telepon harus diisi"),
  message: StringType().isRequired("Pesan harus diisi"),
});

const data = ['umum', 'aduan', 'saran'].map(
  item => ({ label: item, value: item })
);

const Textarea = forwardRef(function Textarea(props, ref) {
  return <Input {...props} ref={ref} as="textarea" />;
});

Textarea.displayName = 'Textarea';
const Index = () => {
  const textButton = "Kirim"
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    phone_number: "",
    request: "",
    message: "",
    images: []
  });
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()
  const cookies = new Cookies()
  const token = cookies.get('token');
  const [dataToken] = useState(() => {
    if (token) {
      return jwtDecode(token);
    }
    return null;
  });

  useEffect(() => {
    // if (dataToken) {
    setFormValue({
      name: dataToken?.name || "",
      email: dataToken?.email || "",
      phone_number: dataToken?.phone_number || "",
      request: "",
      message: "",
      images: []
    })
    // }
  }, [dataToken])

  console.log(dataToken)

  const [openDetail, setOpenDetail] = useState(false);
  const handleCloseDetail = () => setOpenDetail(false);

  const handleOpenDetail = () => setOpenDetail(true)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true);
      try {
        const res = await dispatch(setContact({ ...formValue }));
        const { status, message } = res.payload.data;
        if (status === "success") {
          toast.success(message, optionToast);
          setLoad(false);
          setOpenDetail(false);
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          throw new Error(message);
        }
      } catch (err) {
        setLoad(false);
        setOpenDetail(false);
        toast.error(err.message || `Terjadi kesalahan`, optionToast);
      }
    } else {
      setOpenDetail(false);
      toast.error(`Pastikan semua data yang Anda masukkan sudah benar`, optionToast);
    }
  }
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Kontak</h1>
      </div>
      <section id="form" className="flex justify-center gap-5 py-5 bg-secondary-Light">
        <div className="container">
          <div className="flex flex-col p-3 gap-5 h-full bg-white rounded-lg">
            <h6 className="text-lg font-bold">Kirim Pesan Anda</h6>
            {
              !token ?
                (
                  <Message showIcon type="warning" header="Perhatian">
                    Untuk mengirim pesan, Anda perlu untuk login terlebih dahulu
                  </Message>
                )
                :
                ""
            }
            <Form
              ref={formRef}
              formValue={formValue}
              model={model}
              encType="multipart/form-data"
              fluid
            >
              <Form.Group controlId="nama">
                <Form.ControlLabel>Nama Lengkap</Form.ControlLabel>
                <Form.Control
                  name="name"
                  errorPlacement='bottomEnd'
                  placeholder="Nama Lengkap Anda"
                  disabled={load || dataToken != null}
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      name: e
                    })
                  }}
                />
                <Form.HelpText>Nama Lengkap harus diisi</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.ControlLabel>Email</Form.ControlLabel>
                <Form.Control
                  name="email"
                  errorPlacement='bottomEnd'
                  placeholder="cth. example@gmail.com"
                  disabled={load || dataToken != null}
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      email: e
                    })
                  }}
                />
                <Form.HelpText>Email harus diisi</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="phone_number">
                <Form.ControlLabel>No Telepon</Form.ControlLabel>
                <Form.Control
                  name="phone_number"
                  errorPlacement='bottomEnd'
                  placeholder="cth. 081234567890"
                  disabled={load || dataToken != null}
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      phone_number: e
                    })
                  }}
                />
                <Form.HelpText>No Telepon harus diisi</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="keperluan">
                <Form.ControlLabel>Keperluan</Form.ControlLabel>
                <SelectPicker
                  data={data}
                  searchable={false}
                  style={{ width: 224 }}
                  placeholder="Pilih Keperluan"
                  className="!w-full"
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      request: e
                    })
                  }}
                />
                <Form.HelpText>Keperluan harus diisi</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="pesan">
                <Form.ControlLabel>Isi Pesan</Form.ControlLabel>
                <Form.Control
                  accepter={Textarea}
                  rows={10}
                  name="message"
                  disabled={load}
                  errorPlacement='bottomEnd'
                  placeholder="Isi Pesan Anda"
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      message: e
                    })
                  }}
                />
                <Form.HelpText>Isi Pesan harus diisi</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="gambar">
                <Form.ControlLabel>Gambar</Form.ControlLabel>
                <Form.Control
                  accepter={Uploader}
                  listType="picture-text"
                  accept="image/*"
                  action="#"
                  multiple
                  disabled={load}
                  name="image"
                  errorPlacement='bottomEnd'
                  placeholder="Gambar"
                  onChange={(e) => {
                    let arr = []
                    for (let i = 0; i < e.length; i++) {
                      arr.push(e[i].blobFile)
                    }
                    setFormValue({
                      ...formValue,
                      images: arr
                    })
                  }}
                />
                <Form.HelpText>Gambar harus diisi</Form.HelpText>
              </Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" loading={load} type="button" onClick={handleOpenDetail}>
                  {textButton}
                </Button>
              </ButtonToolbar>
            </Form>
          </div>
        </div>
      </section>
      <Modal openDetail={openDetail} handleCloseDetail={handleCloseDetail} handleSubmit={handleSubmit} load={load} textButton={textButton} />
    </>
  )
}

export default Index