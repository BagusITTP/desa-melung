import { forwardRef, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"
import { Breadcrumb, Button, ButtonToolbar, Form, Input, Panel, Schema, Uploader } from "rsuite"
import optionToast from "../../../constants/optionToast";
import { setArticle } from "../../../store/articleSlice";

const { StringType, ArrayType } = Schema.Types;
const model = Schema.Model({
  title: StringType().isRequired("Judul harus diisi"),
  description: StringType().isRequired("Deskripsi harus diisi"),
  images: ArrayType().isRequired("Gambar harus diisi"),
});

const Textarea = forwardRef(function Textarea(props, ref) {
  return <Input {...props} ref={ref} as="textarea" />;
});

Textarea.displayName = 'Textarea';

const TambahBerita = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [load, setLoad] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true)

      const res = await dispatch(setArticle({ ...formValue }));

      try {
        if (res.payload.data.status === "success") {
          toast.success(res.payload.data.message, optionToast);
          setLoad(false)
          navigate('/admin/berita')
        } else {
          setLoad(false)
          toast.error(res.payload.data.message, optionToast);
        }
      } catch (err) {
        setLoad(false)
        toast.error(`Terjadi kesalahan`, optionToast);
      }
    } else {
      toast.error(`Perisa kembali inputan anda`, optionToast);
    }
  }

  return (
    <>
      <Panel
        header={
          <>
            <Breadcrumb>
              <Breadcrumb.Item href="/admin/berita" className="text-secondary">Daftar Berita</Breadcrumb.Item>
              <Breadcrumb.Item active>Tambah Berita</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
      >
        <ToastContainer />

        <Form
          ref={formRef}
          formValue={formValue}
          model={model}
          encType="multipart/form-data"
          fluid
        >
          <Form.Group controlId="judul">
            <Form.ControlLabel>Judul</Form.ControlLabel>
            <Form.Control
              name="title"
              errorPlacement='bottomEnd'
              placeholder="Judul"
              disabled={load}
              onChange={(e) => {
                setFormValue({
                  ...formValue,
                  title: e
                })
              }}
            />
            <Form.HelpText>Judul harus diisi</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="deskripsi">
            <Form.ControlLabel>Deskripsi</Form.ControlLabel>
            <Form.Control
              accepter={Textarea}
              rows={10}
              name="description"
              disabled={load}
              errorPlacement='bottomEnd'
              placeholder="Deskripsi"
              onChange={(e) => {
                setFormValue({
                  ...formValue,
                  description: e
                })
              }}
            />
            <Form.HelpText>Deskripsi harus diisi</Form.HelpText>
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
            <Button className='bg-sky-500' appearance="primary" loading={load} type="submit" onClick={handleSubmit}>
              Tambah
            </Button>
          </ButtonToolbar>
        </Form>
      </Panel>
    </>
  )
}

export default TambahBerita