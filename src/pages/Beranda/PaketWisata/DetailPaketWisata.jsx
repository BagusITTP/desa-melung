import FlexboxGrid from "rsuite/FlexboxGrid";
import Col from "rsuite/Col";
import Button from "rsuite/Button";
import ButtonToolbar from "rsuite/ButtonToolbar";
import DateRangePicker from "rsuite/DateRangePicker";
import Form from "rsuite/Form";
import Schema from "rsuite/Schema";
import Modal from "rsuite/Modal";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"
import optionToast from "../../../constants/optionToast";
import { BiChevronDown } from "react-icons/bi";
import { HiMiniMegaphone } from "react-icons/hi2";
import { getTourPackage, tourPackageSelector } from "../../../store/tourPackageSlice";
import { useParams, useNavigate } from "react-router-dom";
import rupiah from "../../../utils/rupiah";
import { getPaymentTour, setTourBooking } from "../../../store/tourBookingSlice";
import formatDate from "../../../utils/formatDate";
import ModalConfirm from "../../../components/Modal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
const { beforeToday } = DateRangePicker;

const amount_rule = Schema.Types.NumberType().min(20, "Minimal 20 orang per paket").isRequired("Jumlah Tiket wajib diisi");

const Index = () => {
  const textButton = "Pesan"
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    arrival_date: "",
    departure_date: "",
    amount: ""
  });
  const [defaultData, setDefaultData] = useState([])
  const [load, setLoad] = useState(false)
  const [token, setToken] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const tourPackages = useSelector((state) => tourPackageSelector.selectById(state, id))

  useEffect(() => {
    dispatch(getTourPackage())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(tourPackages)
  }, [tourPackages])

  const [openDetailConfirm, setOpenDetailConfirm] = useState(false);
  const handleCloseDetailConfirm = () => setOpenDetailConfirm(false);
  const handleOpenDetailConfirm = () => setOpenDetailConfirm(true)

  const [openDetail, setOpenDetail] = useState(false);
  const handleCloseDetail = () => setOpenDetail(false);
  const handleOpenDetail = () => setOpenDetail(true)

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
          dispatch(getPaymentTour(result)).then(({ payload }) => toast.success(payload.data.message, optionToast))
          navigate(`/invoice?order_id=${result.order_id}&&type=paket`)
        },
        onPending: function (result) {
          dispatch(getPaymentTour(result)).then(({ payload }) => toast.info(payload.data.message, optionToast))
          window.location.replace(`/paket-wisata/riwayat`)
        },
        onError: function (result) {
          dispatch(getPaymentTour(result)).then(({ payload }) => toast.error(payload.data.message, optionToast))
          window.location.replace(`/paket-wisata/riwayat`)
        },
        onClose: function () {
          toast.error('Transaksi dibatalkan', optionToast)
          window.location.replace(`/paket-wisata/riwayat`)
        }
      })
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true)

      const res = await dispatch(setTourBooking(
        defaultData?.id === 3
          ? { ...formValue, tour_package_id: defaultData?.id }
          : { amount: formValue.amount, total_price: formValue.total_price, tour_package_id: defaultData?.id }
      ));

      try {
        if (res.payload.data.status === "success") {
          setToken(res.payload.data.token)
          toast.success(res.payload.data.message, optionToast);
          setLoad(false)
          setOpenDetailConfirm(false)
        } else {
          setLoad(false)
          setOpenDetailConfirm(false)
          toast.error(res.payload.data.message, optionToast);
        }
      } catch (err) {
        setLoad(false)
        setOpenDetailConfirm(false)
        toast.error(`Terjadi kesalahan`, optionToast);
      }
    } else {
      setOpenDetailConfirm(false)
      toast.error(`Pastikan semua data yang Anda masukkan sudah benar`, optionToast);
    }
  }

  const chunkSize = 3;
  const imageChunks = [];

  for (let i = 0; i < defaultData?.tour_images?.length; i += chunkSize) {
    const chunk = defaultData?.tour_images?.slice(i, i + chunkSize);
    imageChunks.push(chunk);
  }

  function hitungBiayaMakan(tglDatang, tglPulang, jumlahOrang) {
    const tarifMakan = defaultData?.price;
    const tarifPenginapan = 60000; // Tarif penginapan per malam
    const tarifHiburanPerOrang = 25000; // Tarif hiburan per orang

    const tanggalDatang = new Date(tglDatang);
    const tanggalPulang = new Date(tglPulang);
    const oneDay = 24 * 60 * 60 * 1000;

    const diffTime = Math.abs(tanggalPulang - tanggalDatang);
    const diffDays = tanggalDatang.getHours() === tanggalPulang.getHours() ? Math.floor((tanggalPulang - tanggalDatang) / oneDay) === 0 ? 1 : Math.floor((tanggalPulang - tanggalDatang) / oneDay) : Math.ceil(diffTime / (oneDay));

    let jumlahMakan = (tanggalDatang.getHours() >= tanggalPulang.getHours() ? diffDays + 1 : diffDays) * 3

    if (tanggalDatang.getHours() > 12 && tanggalDatang.getHours() <= 18) {
      jumlahMakan--;
    } else if (tanggalDatang.getHours() > 18 && tanggalDatang.getHours() <= 23) {
      jumlahMakan = jumlahMakan - 2;
    }

    if (tanggalPulang.getHours() > 12 && tanggalPulang.getHours() <= 18) {
      jumlahMakan--;
    } else if (tanggalPulang.getHours() >= 1 && tanggalPulang.getHours() <= 12) {
      jumlahMakan = jumlahMakan - 2;
    }

    const biayaMakan = tarifMakan * jumlahMakan;
    const biayaPenginapan = tarifPenginapan * Math.floor(diffTime / (oneDay));
    const biayaHiburan = tarifHiburanPerOrang;
    const totalBiayaSebelumPajak = biayaMakan + biayaPenginapan + biayaHiburan;
    const pajak = totalBiayaSebelumPajak * 0.1; // Pajak 10%
    const totalBiaya = totalBiayaSebelumPajak + pajak;

    console.log({ diff: Math.floor(diffTime / (oneDay)), biayaMakan, biayaPenginapan, biayaHiburan, totalBiayaSebelumPajak, pajak, totalBiaya })

    defaultData?.id == 3
      ? setFormValue({ ...formValue, meal_count: jumlahMakan, total_price: tarifMakan * jumlahOrang * jumlahMakan })
      : setFormValue({ ...formValue, total_price: defaultData?.price * jumlahOrang })
  }

  useEffect(() => {
    hitungBiayaMakan(formValue.arrival_date, formValue.departure_date, formValue.amount)
  }, [formValue.arrival_date, formValue.departure_date, formValue.amount])
  console.log(formValue)

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur()
    e.stopPropagation()

    setTimeout(() => {
      e.target.focus()
    }, 0)
  }

  // console.log(defaultData)
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Paket Wisata</h1>
      </div>
      <section id="title" className="flex justify-center">
        <div className="container">
          <FlexboxGrid justify='space-between' className="flex justify-between items-center flex-wrap border-b-[1px] border-b-secondary py-5">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={12} className="!flex flex-col gap-2">
              <h2 className="text-2xl">{defaultData?.title}</h2>
              <p className="text-base text-secondary-Medium-Dark">{defaultData?.sub_title}</p>
              <p className="text-base text-secondary-Medium-Dark w-5/6">{defaultData?.description}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={12} className="!flex flex-col lg:items-start xl:items-end">
              <h6 className="text-xl font-bold text-primary">{rupiah(defaultData?.price)}</h6>
              <p className="text-base text-secondary-Medium-Dark">per {defaultData?.title === "Paket Live In" ? "1x makan" : "Orang"}</p>
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
                {defaultData?.facilities?.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="!pe-0 bg-secondary-Light font-bold !pt-2 !ps-2 !pb-2 rounded items-center">
              <div className="flex items-center gap-4">
                <HiMiniMegaphone className="w-5 h-5" />
                <h6 className="text-xl">Catatan penting</h6>
              </div>
              <ul className="mt-2 list-disc list-inside flex flex-wrap gap-x-6 gap-y-2">
                <li className="text-sm">Minimal 20 orang per paket</li>
                {
                  defaultData?.title == "Paket Live In"
                    ?
                    (
                      <>
                        <li className="text-sm">Dalam 1 hari, makan 3x</li>
                        <li className="text-sm">Jumlah makan akan menyesuaikan dengan tanggal jam datang dan tanggal jam pulang</li>
                      </>
                    )
                    :
                    ""
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
                        <LazyLoadImage effect="blur" key={index} className={`${imageChunks.length > 1 ? `w-full h-max` : 'w-full sm:w-full lg:w-[45%]'} rounded-lg`} src={image?.url} alt="images" />
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
            fluid
          >
            <FlexboxGrid justify='space-between' className="gap-y-2 h-full">
              <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={15} lg={14} xl={13} className="!ps-0">
                <FlexboxGrid justify='space-around' className="gap-y-2">
                  {
                    defaultData?.id === 3
                      ?
                      (
                        <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={24} className="bg-white !p-4 rounded-lg">
                          <Form.Group controlId="date">
                            <Form.ControlLabel>Tanggal Reservasi</Form.ControlLabel>
                            <DateRangePicker
                              name="date"
                              format="yyyy-MM-dd HH:mm"
                              shouldDisableDate={beforeToday()}
                              block
                              disabled={load}
                              loading={load}
                              onChange={(e) => {
                                setFormValue({
                                  ...formValue,
                                  arrival_date: e?.[0],
                                  departure_date: e?.[1]
                                })
                              }}
                              onClean={() => {
                                setFormValue({
                                  ...formValue,
                                  arrival_date: "",
                                  departure_date: ""
                                })
                              }}
                            />
                          </Form.Group>
                        </FlexboxGrid.Item>
                      )
                      :
                      ""
                  }
                  <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={24} className="bg-white 
                  !p-4 rounded-lg">
                    <Form.Group controlId="jumlah">
                      <Form.ControlLabel>Jumlah Orang</Form.ControlLabel>
                      <Form.Control
                        name="amount"
                        errorPlacement='bottomEnd'
                        placeholder="cth. 20"
                        disabled={load}
                        type="number"
                        onWheel={numberInputOnWheelPreventChange}
                        rule={amount_rule}
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            amount: parseInt(e)
                          })
                        }}
                      />
                      <Form.HelpText>Jumlah Orang harus lebih dari 20 orang</Form.HelpText>
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
                        <h5 className="text-2xl">{rupiah(formValue?.total_price || 0)}</h5>
                        <BiChevronDown className="w-6 h-6 cursor-pointer" onClick={handleOpenDetail} />
                      </div>
                    </div>
                    <ButtonToolbar>
                      <Button appearance="primary" loading={load} type="submit" onClick={handleOpenDetailConfirm}>
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
            <div className="flex flex-col gap-3 border-b-[1px] border-b-secondary w-full">
              {
                defaultData?.id == 3 &&
                (
                  <div className="px-2 py-2 flex flex-col gap-2">
                    <h6 className="text-lg font-bold">Detail</h6>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base">Tanggal Datang</p>
                      <p className="text-base text-right">{formatDate(formValue?.arrival_date)}</p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base">Tanggal Datang</p>
                      <p className="text-base text-right">{formatDate(formValue?.departure_date)}</p>
                    </div>
                  </div>
                )
              }
              <div className="px-2 py-2 flex flex-col gap-2">
                <h6 className="text-lg font-bold">Detail Pemesanan</h6>
                {
                  defaultData?.id == 3
                    ?
                    (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base">Harga Paket</p>
                          <p className="text-base">{rupiah(defaultData?.price || 0)}</p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base">Jumlah Makan</p>
                          <p className="text-sm text-secondary">x{formValue?.meal_count || 0}</p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base">Jumlah Orang</p>
                          <p className="text-base text-right">{formValue?.amount || 0} orang</p>
                        </div>
                      </>
                    )
                    :
                    (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base">Harga Paket</p>
                          <p className="text-base">{rupiah(defaultData?.price || 0)}</p>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <p className="text-base">Jumlah Orang</p>
                          <p className="text-base text-right">{formValue?.amount || 0} orang</p>
                        </div>
                      </>
                    )
                }
              </div>
            </div>
            <div className="flex justify-between items-center w-full p-1">
              <p className="text-base">Sub Total</p>
              <p className="text-base">{rupiah(formValue?.total_price / formValue?.amount || 0)} per orang</p>
            </div>
            <div className="flex justify-between items-center w-full p-1">
              <p className="text-xl font-bold">Total</p>
              <p className="text-2xl font-bold">{rupiah(formValue?.total_price || 0)}</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ModalConfirm openDetail={openDetailConfirm} handleCloseDetail={handleCloseDetailConfirm} handleSubmit={handleSubmit} load={load} textButton={textButton} />
    </>
  )
}

export default Index