import { FlexboxGrid, Col, Form, ButtonToolbar, Button, Schema, SelectPicker, Modal } from "rsuite"
import ImageList from "../../../constants/ImageList";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"
import optionToast from "../../../constants/optionToast";
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const { StringType, ArrayType } = Schema.Types;
const model = Schema.Model({
  title: StringType().isRequired("Judul harus diisi"),
  description: StringType().isRequired("Deskripsi harus diisi"),
  images: ArrayType().isRequired("Gambar harus diisi"),
});

const data = ['Motor', 'Mobil'].map(
  item => ({ label: item, value: item })
);

const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [load, setLoad] = useState(false)
  // const navigate = useNavigate()
  // const dispatch = useDispatch()

  const [headerDetail, setHeaderDetail] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const handleCloseDetail = () => setOpenDetail(false);

  const handleOpenDetail = (data, header) => {
    setDataDetail(data)
    setHeaderDetail(header)
    setOpenDetail(true)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true)

      // const res = await dispatch(setArticle({ ...formValue }));

      //   try {
      //     if (res.payload.data.status === "success") {
      //       toast.success(res.payload.data.message, optionToast);
      //       setLoad(false)
      //       navigate('/admin/berita')
      //     } else {
      //       setLoad(false)
      //       toast.error(res.payload.data.message, optionToast);
      //     }
      //   } catch (err) {
      //     setLoad(false)
      //     toast.error(`Terjadi kesalahan`, optionToast);
      //   }
      // } else {
      //   toast.error(`Perisa kembali inputan anda`, optionToast);
    }
  }

  const chunkSize = 3;

  const imageChunks = [];

  for (let i = 0; i < ImageList.length; i += chunkSize) {
    const chunk = ImageList.slice(i, i + chunkSize);
    imageChunks.push(chunk);
  }
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Tiket Masuk</h1>
      </div>
      <section id="title" className="flex justify-center">
        <div className="container">
          <div className="flex flex-col gap-2 border-b-[1px] border-b-secondary py-5">
            <h2 className="text-2xl">Wisata Pagubugan Melung</h2>
            <p className="text-base text-secondary w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta commodi dolores, alias in accusamus explicabo ullam corporis hic aliquid suscipit enim laudantium officia cum, illo ab obcaecati! Laboriosam soluta nulla nam vero praesentium ab eos repellat quas possimus suscipit nisi minima blanditiis unde ratione harum excepturi necessitatibus, quam quaerat itaque?</p>
          </div>
        </div>
      </section>
      <section id="description" className="flex justify-center">
        <div className="container">
          <FlexboxGrid justify='space-around' className="gap-y-2 border-b-[1px] border-b-secondary py-5">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="!ps-0">
              <h6 className="text-lg">Fasilitas</h6>
              <ul className="mt-2 list-disc flex flex-wrap gap-x-6 gap-y-2 list-inside">
                <li className="text-sm">Lorem ipsum dolor sit ametfdsfsdfs jdnskas</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
              </ul>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="!pe-0">
              <h6 className="text-lg">Lokasi Unik</h6>
              <ul className="mt-2 list-disc list-inside flex flex-wrap gap-x-6 gap-y-2">
                <li className="text-sm">Lorem ipsum dolor sit ametfdsfsdfs jdnskas</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
                <li className="text-sm">Lorem ipsum dolor sit amet</li>
              </ul>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
      <section id="gallery" className="flex justify-center py-5">
        <div className="container flex flex-col gap-5">
          <h4 className="text-center text-2xl">Pemandangan Indah dan Serunya Belajar di Desa Wisata Melung</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {
              imageChunks.map((chunk, index) => (
                <div key={index} className="grid gap-4">
                  {
                    chunk.map((image, index) => (
                      <img key={index} loading='lazy' className="h-full max-w-full rounded-lg" src={image} alt="images" />
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      </section>
      <section id="form" className="flex justify-center py-5 bg-secondary-Light">
        <div className="container flex flex-col gap-3 h-full md:h-auto">
          <h4 className=" text-2xl">Daftarkan Sekarang</h4>
          <Form
            ref={formRef}
            formValue={formValue}
            model={model}
            encType="multipart/form-data"
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
                        name="amount"
                        errorPlacement='bottomEnd'
                        placeholder="cth. 5"
                        disabled={load}
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
                      <SelectPicker
                        data={data}
                        searchable={false}
                        style={{ width: 224 }}
                        placeholder="Pilih Kendaraan"
                        className="!w-full"
                      />
                      <Form.HelpText>Kendaraan harus diisi</Form.HelpText>
                    </Form.Group>

                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={9} lg={9} xl={11} className="!flex justify-center items-center !h-full">
                <div className="bg-white px-10 py-6 rounded-md flex flex-col gap-3 w-full sm:w-full md:w-fit lg:w-fit xl:w-fit">
                  <div className="flex flex-col gap-1 justify-start">
                    <p className="text-lg">Total Harga</p>
                    <div className="flex gap-2">
                      <h5 className="text-2xl">Rp. 50.000</h5>
                      <ChevronDownIcon className="w-6 h-6 cursor-pointer" onClick={() => handleOpenDetail()} />
                    </div>
                  </div>
                  <ButtonToolbar>
                    <Button appearance="primary" loading={load} type="submit" onClick={handleSubmit}>
                      Pesan
                    </Button>
                  </ButtonToolbar>
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
              <div className="flex justify-between w-full">
                <p className="text-base">Tanggal Datang</p>
                <p className="text-base">20 Desember 2023 12:00</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-base">Tanggal Datang</p>
                <p className="text-base">20 Desember 2023 12:00</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-base">Jumlah Makan</p>
                <p className="text-base">9x</p>
              </div>
            </div>
            <div className="px-2 py-2 flex flex-col gap-2">
              <h6 className="text-lg font-bold">Detail</h6>
              <div className="flex justify-between w-full">
                <p className="text-base">Tanggal Datang</p>
                <p className="text-base">20 Desember 2023 12:00</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-base">Tanggal Datang</p>
                <p className="text-base">20 Desember 2023 12:00</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-base">Jumlah Makan</p>
                <p className="text-base">9x</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full p-2">
            <p className="text-xl font-bold">Total</p>
            <p className="text-2xl font-bold">Rp. 50.000</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Index