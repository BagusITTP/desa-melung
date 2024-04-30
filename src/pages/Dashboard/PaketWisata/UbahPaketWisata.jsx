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
import { forwardRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tourPackageSelector, getTourPackage, updateTourPackage } from "../../../store/tourPackageSlice";

const { StringType, NumberType } = Schema.Types;
const model = Schema.Model({
  title: StringType().isRequired("Judul harus diisi"),
  sub_title: StringType().isRequired("Sub judul harus diisi"),
  description: StringType().isRequired("Deskripsi harus diisi"),
  price: NumberType().isRequired("Harga harus diisi"),
});

const Textarea = forwardRef(function Textarea(props, ref) {
  return <Input {...props} ref={ref} as="textarea" />;
});

Textarea.displayName = 'Textarea';

const UbahPaketWisata = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    title: "",
    sub_title: "",
    description: "",
    price: "",
  });
  const [facilities, setFacilities] = useState([])
  const [load, setLoad] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  const tourPackages = useSelector((state) => tourPackageSelector.selectById(state, id))

  useEffect(() => {
    dispatch(getTourPackage())
  }, [dispatch])


  useEffect(() => {
    setFormValue(tourPackages)
    setFacilities(tourPackages?.facilities)
  }, [tourPackages])

  const handleFacilitiesChange = (index, newValue) => {
    const newFacilities = [...facilities];
    newFacilities[index] = newValue;
    setFacilities(newFacilities);
  };

  const addFacilities = () => {
    setFacilities([...facilities, '']);
  };

  const removeFacilities = (index) => {
    const newFacilities = [...facilities];
    newFacilities.splice(index, 1);
    setFacilities(newFacilities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formRef.current.check()) {
      toast.error(`Pastikan semua data yang Anda masukkan sudah benar`, optionToast);
      return;
    }

    const { title, sub_title, price, facilities, description, images } = formValue;
    setLoad(true);

    const arr = images ? images.filter((item) => item !== undefined) : [];

    const res = await dispatch(updateTourPackage({
      title,
      sub_title,
      description,
      price,
      facilities,
      images: arr,
      id
    }));

    try {
      if (res.payload.data.status === "success") {
        toast.success(res.payload.data.message, optionToast);
        navigate('/admin/paket-wisata');
      } else {
        setLoad(false);
        toast.error(res.payload.data.message, optionToast);
      }
    } catch (err) {
      setLoad(false);
      toast.error(`Terjadi kesalahan`, optionToast);
    }
  }

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur()
    e.stopPropagation()

    setTimeout(() => {
      e.target.focus()
    }, 0)
  }
  return (
    <>
      <Panel
        header={
          <>
            <Breadcrumb>
              <Breadcrumb.Item href="/admin/paket-wisata" className="text-secondary">Daftar Paket Wisata</Breadcrumb.Item>
              <Breadcrumb.Item active>Ubah Paket Wisata</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
      >
        <ToastContainer />

        <Form
          ref={formRef}
          onChange={setFormValue}
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
              value={formValue?.title}
              onChange={(data) => setFormValue({ ...formValue, title: data })}
            />
            <Form.HelpText>Judul harus diisi</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="sub_judul">
            <Form.ControlLabel>Sub Judul</Form.ControlLabel>
            <Form.Control
              name="sub_title"
              errorPlacement='bottomEnd'
              placeholder="Sub Judul"
              disabled={load}
              value={formValue?.sub_title}
              onChange={(data) => setFormValue({ ...formValue, sub_title: data })}
            />
            <Form.HelpText>Sub Judul harus diisi</Form.HelpText>
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
              value={formValue?.description}
              onChange={(e) => {
                setFormValue({
                  ...formValue,
                  description: e
                })
              }}
            />
            <Form.HelpText>Deskripsi harus diisi</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="price">
            <Form.ControlLabel>Harga Paket</Form.ControlLabel>
            <Form.Control
              name="price"
              errorPlacement='bottomEnd'
              placeholder="Rp. 100.000"
              disabled={load}
              type="number"
              value={formValue?.price}
              onWheel={numberInputOnWheelPreventChange}
              onChange={(data) => setFormValue({ ...formValue, price: data })}
            />
            <Form.HelpText>Harga Paket harus diisi</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="image">
            <Form.ControlLabel>Gambar</Form.ControlLabel>
            <Form.Control
              accepter={Uploader}
              listType="picture-text"
              // defaultFileList={formValue?.images}
              fileList={formValue?.tour_images}
              accept="image/*"
              action="#"
              multiple
              removable={!formValue?.tour_images?.id ? true : false}
              disabled={load}
              name="image"
              errorPlacement='bottomEnd'
              placeholder="Image"
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

          <Form.Group controlId="facilities">
            <Form.ControlLabel>Fasilitas</Form.ControlLabel>
            {facilities?.map((facility, index) => (
              (
                <div className="mb-3 flex gap-2 align-items-center" key={index}>
                  <Form.Control
                    required
                    name="facilites"
                    disabled={load}
                    placeholder="Masukkan fasilitas"
                    value={facility}
                    onChange={(e) => handleFacilitiesChange(index, e)}
                  />
                  <Button className="!bg-primary-Red !text-white" onClick={() => removeFacilities(index)} disabled={load}>
                    Hapus
                  </Button>
                </div>
              )
            ))}
            <Button className="!bg-primary-Yellow" onClick={addFacilities} disabled={load}>
              Tambah Manfaat
            </Button>
            <Form.HelpText>Fasilitas harus diisi</Form.HelpText>
          </Form.Group>

          <ButtonToolbar>
            <Button className='bg-sky-500' appearance="primary" loading={load} type="submit" onClick={handleSubmit}>
              Ubah
            </Button>
          </ButtonToolbar>
        </Form>
      </Panel>
    </>
  )
}

export default UbahPaketWisata