import { ToastContainer, toast } from "react-toastify"
import { Breadcrumb, Button, ButtonToolbar, Form, Input, Panel, Schema, Uploader, Modal } from "rsuite"
import optionToast from "../../../constants/optionToast";
import CloseIcon from '@rsuite/icons/Close';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { attractionSelector, getAttraction, updateAttraction } from "../../../store/attractionSlice";
import { getVehicle } from "../../../store/vehicleSlice";
import { deleteAttractionImage } from "../../../store/attractionImage";

const { StringType, NumberType } = Schema.Types;
const model = Schema.Model({
  motor_price: NumberType().isRequired("Harga motor harus diisi"),
  mobil_price: NumberType().isRequired("Harga mobil harus diisi"),
  ticket_price: NumberType().isRequired("Harga ticket harus diisi"),
  description: StringType().isRequired("Deskripsi harus diisi"),
});

const Textarea = forwardRef(function Textarea(props, ref) {
  return <Input {...props} ref={ref} as="textarea" />;
});

Textarea.displayName = 'Textarea';

const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({});
  const [datas, setDatas] = useState([])
  const [facilities, setFacilities] = useState([])
  const [locations, setLocations] = useState([])
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()

  const [headerDeleteImage, setHeaderDeleteImage] = useState();
  const [openDeleteImage, setOpenDeleteImage] = useState(false);
  const [idDeleteImage, setIdDeleteImage] = useState();
  const handleCloseDeleteImage = () => setOpenDeleteImage(false);

  const id = 1

  const attractions = useSelector((state) => attractionSelector.selectById(state, id))

  useEffect(() => {
    dispatch(getAttraction())
  }, [dispatch])

  useEffect(() => {
    dispatch(getVehicle()).then(({ payload }) => setDatas(payload?.data))
  }, [dispatch])

  useEffect(() => {
    setFormValue(attractions)
    setFormValue(prevData => (
      {
        ...prevData,
        motor_price: datas[0]?.price,
        mobil_price: datas[1]?.price
      }
    ))
    setFacilities(attractions?.facilities)
    setLocations(attractions?.locations)
  }, [attractions, datas])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formRef.current.check()) {
      toast.error(`Perisa kembali inputan anda`, optionToast);
      return;
    }

    const { motor_price, mobil_price, ticket_price, description, images } = formValue;
    setLoad(true);

    const res = await dispatch(updateAttraction({ motor_price, mobil_price, ticket_price, description, facilities, locations, images }));

    try {
      if (res.payload.data.status === "success") {
        toast.success(res.payload.data.message, optionToast);
        window.location.reload();
        setLoad(false);
      } else {
        toast.error(res.payload.data.message, optionToast);
        setLoad(false);
      }
    } catch (err) {
      toast.error(`Terjadi kesalahan`, optionToast);
      setLoad(false);
    }
  }

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

  const handleLocationsChange = (index, newValue) => {
    const newLocations = [...locations];
    newLocations[index] = newValue;
    setLocations(newLocations);
  };

  const addLocations = () => {
    setLocations([...locations, '']);
  };

  const removeLocations = (index) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setLocations(newLocations);
  };

  const handleOpenDeleteImage = (id, header) => {
    setIdDeleteImage(id)
    setHeaderDeleteImage(header)
    setOpenDeleteImage(true)
  };

  const handleDeleteImage = async () => {
    setLoad(true)
    const res = await dispatch(deleteAttractionImage(idDeleteImage))
    setOpenDeleteImage(false)
    await dispatch(getAttraction())
    setLoad(false)
    toast.success(res.payload.message, optionToast);
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
              <Breadcrumb.Item>Tiket Masuk Pagubugan</Breadcrumb.Item>
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
          <Form.Group controlId="motor_price">
            <Form.ControlLabel>Harga motor</Form.ControlLabel>
            <Form.Control
              name="title"
              errorPlacement='bottomEnd'
              placeholder="Rp. 100.000"
              disabled={load}
              value={formValue?.motor_price}
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              onChange={(data) => setFormValue({ ...formValue, motor_price: data })}
            />
            <Form.HelpText>Harga motor harus diisi</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="mobil_price">
            <Form.ControlLabel>Harga mobil</Form.ControlLabel>
            <Form.Control
              name="title"
              errorPlacement='bottomEnd'
              placeholder="Rp. 100.000"
              disabled={load}
              value={formValue?.mobil_price}
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              onChange={(data) => setFormValue({ ...formValue, mobil_price: data })}
            />
            <Form.HelpText>Harga mobil harus diisi</Form.HelpText>
          </Form.Group>

          <Form.Group controlId="ticket_price">
            <Form.ControlLabel>Harga Tiket Masuk</Form.ControlLabel>
            <Form.Control
              name="title"
              errorPlacement='bottomEnd'
              placeholder="Rp. 100.000"
              disabled={load}
              value={formValue?.ticket_price}
              type="number"
              onWheel={numberInputOnWheelPreventChange}
              onChange={(data) => setFormValue({ ...formValue, ticket_price: data })}
            />
            <Form.HelpText>Harga Tiket Masuk harus diisi</Form.HelpText>
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

          <Form.Group controlId="image">
            <Form.ControlLabel>Gambar</Form.ControlLabel>
            <Form.Control
              accepter={Uploader}
              listType="picture-text"
              // defaultFileList={formValue?.images}
              // fileList={formValue?.attraction_images}
              accept="image/*"
              action="#"
              multiple
              removable={!formValue?.attraction_images?.id ? true : false}
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
          </Form.Group>

          <Form.Group controlId="locations">
            <Form.ControlLabel>Lokasi Unik</Form.ControlLabel>
            {locations?.map((location, index) => (
              (
                <div className="mb-3 flex gap-2 align-items-center" key={index}>
                  <Form.Control
                    required
                    name="locations"
                    disabled={load}
                    placeholder="Masukkan lokasi unik"
                    value={locations[index]}
                    onChange={(e) => handleLocationsChange(index, e)}
                  />
                  <Button className="!bg-primary-Red !text-white" onClick={() => removeLocations(index)} disabled={load}>
                    Hapus
                  </Button>
                </div>
              )
            ))}
            <Button className="!bg-primary-Yellow" onClick={addLocations} disabled={load}>
              Tambah Manfaat
            </Button>
          </Form.Group>

          <ButtonToolbar>
            <Button className='bg-sky-500' appearance="primary" loading={load} type="submit" onClick={handleSubmit}>
              Ubah
            </Button>
          </ButtonToolbar>
        </Form>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", padding: "20px" }}>
          {formValue?.attraction_images?.map(({ url, id, name }, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img src={url} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              <button
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  padding: "2px 5px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                }}
                className="bg-primary text-white"
                onClick={() => handleOpenDeleteImage(id, name)}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>

        <Modal backdrop="static" role="alertdialog" open={openDeleteImage} onClose={handleCloseDeleteImage} size="xs">
          <Modal.Body>
            <RemindIcon style={{ color: '#ffb300', fontSize: 24 }} />
            Apakah kamu yakin untuk menghapus data dengan gambar <span className="font-bold">{headerDeleteImage}</span> ini?
          </Modal.Body>
          <Modal.Footer>
            <Button className='bg-red-500' color="red" onClick={handleDeleteImage} loading={load} appearance="primary">
              Hapus
            </Button>
            <Button className='bg-slate-100' onClick={handleCloseDeleteImage} appearance="subtle">
              Batal
            </Button>
          </Modal.Footer>
        </Modal>
      </Panel>
    </>
  )
}

export default Index