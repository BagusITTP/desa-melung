import { FlexboxGrid, Col, Form, ButtonToolbar, Button, Schema, SelectPicker, Modal } from "rsuite"
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"
import optionToast from "../../../constants/optionToast";
import { BiChevronDown } from "react-icons/bi";
import { attractionSelector, getAttraction } from "../../../store/attractionSlice";
import { useSelector } from 'react-redux'
import rupiah from "../../../utils/rupiah";
import { getVehicle } from "../../../store/vehicleSlice";
import { getPaymentTicket, setTicketBooking } from "../../../store/ticketBookingSlice";
import { useNavigate } from 'react-router-dom'

const { NumberType } = Schema.Types;
const model = Schema.Model({
  amount: NumberType().isRequired('Amount is required'),
  vehicle_id: NumberType().isRequired('Vehicle is required'),
});

const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    amount: "",
    vehicle_id: "",
    total_price: ""
  });
  const [defaultData, setDefaultData] = useState([]);
  const [listVehicle, setListVehicle] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [token, setToken] = useState("");
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const attractions = useSelector(attractionSelector.selectAll)

  useEffect(() => {
    dispatch(getAttraction())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(attractions)
  }, [attractions])

  useEffect(() => {
    dispatch(getVehicle()).then(({ payload }) => setListVehicle(payload?.data))
  }, [dispatch])

  useEffect(() => {
    if (listVehicle.length !== 0) {
      const data_vehiclePrice = []
      // console.log(data);

      listVehicle?.map((data) => {
        data_vehiclePrice.push({
          id: data.id,
          label: data.type,
          value: data.id
        })
      })
      setVehicles(data_vehiclePrice);
    }
  }, [listVehicle])

  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const handleCloseDetail = () => setOpenDetail(false);

  const handleOpenDetail = (data) => {
    setDataDetail(data)
    setOpenDetail(true)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true)

      const res = await dispatch(setTicketBooking(formValue));

      try {
        if (res.payload.data.status === "success") {
          setToken(res.payload.data.token)
          toast.success(res.payload.data.message, optionToast);
          setLoad(false)
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

  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;

    const myMidtransClientKey = import.meta.env.VITE_CLIENTKEY;
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    }
  }, []);

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: function (result) {
          dispatch(getPaymentTicket(result)).then(({ payload }) => toast.success(payload.data.message, optionToast))
          navigate(`/invoice?order_id=${result.order_id}&&type=tiket`)
        },
        onPending: function (result) {
          dispatch(getPaymentTicket(result)).then(({ payload }) => toast.info(payload.data.message, optionToast))
        },
        onError: function (result) {
          dispatch(getPaymentTicket(result)).then(({ payload }) => toast.error(payload.data.message, optionToast))
        },
        onClose: function () {
          toast.error('Transaksi dibatalkan', optionToast)
        }
      })
    }
  }, [token])

  const chunkSize = 3;
  const imageChunks = [];

  for (let i = 0; i < defaultData[0]?.attraction_images?.length; i += chunkSize) {
    const chunk = defaultData[0]?.attraction_images?.slice(i, i + chunkSize);
    imageChunks.push(chunk);
  }

  const getTotal = () => {
    const selectedVehicle = listVehicle.find((data) => data.id === formValue.vehicle_id);
    const ticketPrice = formValue.amount > 0 ? defaultData[0]?.ticket_price * formValue.amount : 0;
    const total = ticketPrice + (selectedVehicle ? selectedVehicle.price : 0);
    setFormValue({
      ...formValue,
      total_price: total
    });
  }

  useEffect(() => {
    getTotal()
  }, [formValue.vehicle_id, formValue.amount])

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur()
    e.stopPropagation()

    setTimeout(() => {
      e.target.focus()
    }, 0)
  }
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Tiket Masuk</h1>
      </div>
      <section id="title" className="flex justify-center">
        <div className="container">
          <FlexboxGrid justify='space-between' className="flex justify-between items-center flex-wrap border-b-[1px] border-b-secondary py-5">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={12} className="!flex flex-col gap-2">
              <h2 className="text-2xl">Wisata Pagubugan Melung</h2>
              <p className="text-base text-secondary w-5/6">{defaultData[0]?.description}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={12} className="!flex flex-col lg:items-start xl:items-end">
              <h6 className="text-xl font-bold text-primary">{rupiah(defaultData[0]?.ticket_price || 0)}</h6>
              <p className="text-base text-secondary">per orang</p>
              <a className="text-white bg-primary hover:bg-primary-Medium-Dark px-3 py-2 mt-2 rounded no-underline hover:no-underline w-min" href="#form">Pesan</a>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
      <section id="description" className="flex justify-center">
        <div className="container">
          <FlexboxGrid justify='space-around' className="gap-y-2 py-5">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="!ps-0">
              <h6 className="text-lg">Fasilitas</h6>
              <ul className="mt-2 list-disc flex flex-wrap gap-x-2 gap-y-2 list-inside">
                {
                  defaultData[0]?.facilities?.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))
                }
              </ul>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="!pe-0">
              <h6 className="text-lg">Lokasi Unik</h6>
              <ul className="mt-2 list-disc list-inside flex flex-wrap gap-x-2 gap-y-2">
                {
                  defaultData[0]?.locations?.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))
                }
              </ul>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
      <section id="gallery" className={`flex justify-center ${imageChunks.length === 0 ? 'hidden' : ''}`}>
        <div className="container">
          <div className="flex flex-col gap-5 py-5 border-t-[1px] border-t-secondary">
            <h4 className="text-center text-2xl">Pemandangan Indah dan Serunya Belajar di Desa Wisata Melung</h4>
            <div className={`${imageChunks.length > 1 ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${imageChunks.length > 4 ? 3 : imageChunks.length} xl:grid-cols-${imageChunks.length > 4 ? 3 : imageChunks.length}` : 'flex justify-center'} gap-4`}>
              {
                imageChunks.map((chunk, index) => (
                  <div key={index} className={`${imageChunks.length > 1 ? `grid` : 'flex justify-center flex-wrap w-full'} ${chunk.length >= 1 && chunk.length < 3 ? 'auto-rows-max' : ''} gap-2`}>
                    {
                      chunk.map((image, index) => (
                        <img key={index} loading='lazy' className={`${imageChunks.length > 1 ? `w-full h-full` : 'w-full sm:w-full lg:w-[45%]'} rounded-lg`} src={image?.url} alt="images" />
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
      <section id="form" className="flex justify-center py-5 bg-secondary-Light">
        <div className="container flex flex-col gap-3 h-full md:h-auto">
          <h4 className=" text-2xl">Detail Pesanan</h4>
          <Form
            ref={formRef}
            formValue={formValue}
            model={model}
            fluid
          >
            <FlexboxGrid justify='space-between' className="gap-y-2 h-full">
              <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={15} lg={14} xl={13} className="!ps-0">
                <FlexboxGrid justify='space-around' className="gap-y-2">
                  <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={24} className="bg-white 
                  !p-4 rounded-lg">
                    <Form.Group controlId="jumlah">
                      <Form.ControlLabel>Jumlah Orang</Form.ControlLabel>
                      <Form.Control
                        label="Jumlah Orang"
                        name="amount"
                        errorPlacement='bottomEnd'
                        placeholder="cth. 5"
                        disabled={load}
                        type="number"
                        onWheel={numberInputOnWheelPreventChange}
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            amount: e
                          })
                        }}
                      />
                      <Form.HelpText>Jumlah Orang harus diisi</Form.HelpText>
                    </Form.Group>

                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={24} className="bg-white 
                  !p-4 rounded-lg">
                    <Form.Group controlId="kendaraan">
                      <Form.ControlLabel>Kendaraan</Form.ControlLabel>
                      <Form.Control
                        name="kendaraan"
                        accepter={SelectPicker}
                        data={vehicles}
                        searchable={false}
                        style={{ width: 224 }}
                        placeholder="Pilih Kendaraan"
                        className="!w-full"
                        disabled={load}
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            vehicle_id: e
                          })
                        }}
                      />
                      <Form.HelpText>Kendaraan harus diisi</Form.HelpText>
                    </Form.Group>

                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={9} lg={9} xl={11} className="!flex justify-center items-center !h-full !pl-0 sm:!pl-0 md:!pl-1 xl:!pl-1">
                <div className=" flex justify-center w-full sm:w-full md:w-fit lg:w-fit xl:w-full">
                  <div className="bg-white flex flex-col gap-3 px-6 py-6 rounded-md w-full sm:w-full md:w-full xl:w-1/2">
                    <div className="flex flex-col gap-1 justify-start">
                      <p className="text-lg">Total Harga</p>
                      <div className="flex gap-2">
                        <h5 className="text-2xl">{rupiah(formValue.total_price || 0)}</h5>
                        <BiChevronDown className="w-6 h-6 cursor-pointer" onClick={() => handleOpenDetail({ jumlah: formValue.amount, kendaraan: formValue.vehicle_id, total: formValue.total_price, harga: defaultData[0].ticket_price })} />
                      </div>
                    </div>
                    <ButtonToolbar>
                      <Button appearance="primary" loading={load} type="submit" onClick={handleSubmit}>
                        Pesan
                      </Button>
                    </ButtonToolbar>
                  </div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </section>

      <Modal role="alertdialog" open={openDetail} onClose={handleCloseDetail} size="sm">
        <Modal.Header>
          <Modal.Title>Detail Pemesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3 border-b-[1px] border-b-secondary w-full">
            <div className="px-2 py-2 flex flex-col gap-2">
              <h6 className="text-lg font-bold">Detail</h6>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1">
                  <p className="text-base">Jumlah Orang</p>
                  <p className="text-sm text-secondary">x{dataDetail.jumlah}</p>
                </div>
                <p className="text-base">{rupiah(dataDetail.jumlah * dataDetail.harga || 0)}</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1">
                  <p className="text-base">Kendaraan</p>
                  <p className="text-sm text-secondary">({listVehicle[dataDetail.kendaraan - 1]?.type})</p>
                </div>
                <p className="text-base">{rupiah(listVehicle[dataDetail.kendaraan - 1]?.price || 0)}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full p-2">
            <p className="text-xl font-bold">Total</p>
            <p className="text-2xl font-bold">{rupiah(dataDetail.total)}</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Index