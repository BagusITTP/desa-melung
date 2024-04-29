import { forwardRef, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"
import Breadcrumb from "rsuite/Breadcrumb"
import Button from "rsuite/Button";
import ButtonToolbar from "rsuite/ButtonToolbar";
import Form from "rsuite/Form";
import Input from "rsuite/Input";
import Panel from "rsuite/Panel";
import Schema from "rsuite/Schema";
import Uploader from "rsuite/Uploader";
import optionToast from "../../../constants/optionToast";
import { setArticle } from "../../../store/articleSlice";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

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
      toast.error(`Pastikan semua data yang Anda masukkan sudah benar`, optionToast);
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

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
          </Form.Group>

          <Form.Group controlId="deskripsi">
            <Form.ControlLabel>Deskripsi</Form.ControlLabel>
            <ReactQuill
              theme="snow"
              value={formValue.description}
              onChange={(e) => {
                setFormValue({
                  ...formValue,
                  description: e
                })
              }}
              modules={modules}
              formats={formats}
            />
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