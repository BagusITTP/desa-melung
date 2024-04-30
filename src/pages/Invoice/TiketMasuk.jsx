import { Link, useSearchParams } from "react-router-dom";
import Logo from "../../assets/Logo_small.svg";
import Button from "rsuite/Button";
import ButtonToolbar from "rsuite/ButtonToolbar";
import { getOrderIdTicket, ticketBookingSelector } from "../../store/ticketBookingSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../utils/formatDate";
import rupiah from "../../utils/rupiah";
import { useReactToPrint } from "react-to-print";
import TiketMasukPrint from "../Print/TiketMasukPrint";

const TiketMasuk = () => {
  const componentRef = useRef();
  const [defaultData, setDefaultData] = useState([])
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const id = searchParams.get("order_id")

  const ticketBooking = useSelector(ticketBookingSelector.selectAll)

  useEffect(() => {
    dispatch(getOrderIdTicket(id))
  }, [dispatch, id])

  useEffect(() => {
    setDefaultData(ticketBooking?.[0])
  }, [ticketBooking])

  console.log(defaultData)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  let payment_status = defaultData?.payment_status

  switch (payment_status) {
    case "success":
      payment_status = "Dibayar"
      break
    case "waiting":
      payment_status = "Menunggu Pembayaran"
      break
    default:
      payment_status = "Dibatalkan"
      break
  }
  return (
    <>
      <div className="flex flex-col p-4 sm:p-10 bg-white shadow-md rounded-xl">
        <div className="flex justify-between">
          <div>
            <img src={Logo} alt="logo melung" />

            <h1 className="mt-2 text-lg md:text-xl font-semibold text-primary">Desa Wisata Melung</h1>
          </div>

          <div className="text-end">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Invoice #</h2>
            <span className="mt-1 block text-gray-500">{id}</span>

            <address className="mt-4 not-italic text-gray-800">
              Kec. Kedungbanteng, <br />
              Kab. Banyumas, <br />
              Jawa Tengah
            </address>
          </div>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Bill to:</h3>
            <h3 className="text-lg font-semibold text-gray-800">{defaultData?.user?.name}</h3>
            <dl className="grid sm:grid-cols-5 gap-x-1 mt-3">
              <dt className="col-span-2 font-semibold text-gray-800">Status Pembayaran:</dt>
              <dd className="col-span-3 text-gray-500 mb-0">{payment_status}</dd>
            </dl>
          </div>

          <div className="sm:text-end">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2">
              {
                defaultData?.arrival_date &&
                (
                  <>
                    <dl className="grid sm:grid-cols-5 gap-x-1">
                      <dt className="col-span-3 font-semibold text-gray-800">Tanggal Datang:</dt>
                      <dd className="col-span-2 text-gray-500 mb-0">03/10/2018</dd>
                    </dl>
                    <dl className="grid sm:grid-cols-5 gap-x-1">
                      <dt className="col-span-3 font-semibold text-gray-800">Tanggal Pulang:</dt>
                      <dd className="col-span-2 text-gray-500 mb-0">03/10/2018</dd>
                    </dl>
                  </>
                )
              }
              <dl className="grid sm:grid-cols-9 gap-x-1">
                <dt className="col-span-3 font-semibold text-gray-800">Tanggal Transaksi:</dt>
                <dd className="col-span-6 text-gray-500 mb-0">{formatDate(defaultData?.createdAt)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="border border-gray-200 p-4 rounded-lg space-y-4">
            <div className="hidden sm:grid sm:grid-cols-5">
              <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">Item</div>
              <div className="text-start text-xs font-medium text-gray-500 uppercase">Jumlah</div>
              <div className="text-start text-xs font-medium text-gray-500 uppercase">Harga</div>
              <div className="text-end text-xs font-medium text-gray-500 uppercase">Total</div>
            </div>

            <div className="hidden sm:block border-b border-gray-200"></div>

            {
              defaultData?.arrival_date
                ?
                ""
                :
                (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      <div className="col-span-full sm:col-span-2">
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Item</h5>
                        <p className="font-medium text-gray-800">Tiket Pagubugan Melung</p>
                      </div>
                      <div>
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Jumlah</h5>
                        <p className="text-gray-800">{defaultData?.amount}</p>
                      </div>
                      <div>
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Harga</h5>
                        <p className="text-gray-800">{rupiah((defaultData?.total_price - defaultData?.vehicle?.price) / defaultData?.amount || 0)}</p>
                      </div>
                      <div>
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Total</h5>
                        <p className="sm:text-end text-gray-800">{rupiah(defaultData?.total_price - defaultData?.vehicle?.price || 0)}</p>
                      </div>
                    </div>

                    <div className="sm:hidden border-b border-gray-200"></div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      <div className="col-span-full sm:col-span-2">
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Item</h5>
                        <p className="font-medium text-gray-800">{defaultData?.vehicle?.type}</p>
                      </div>
                      <div>
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Jumlah</h5>
                        <p className="text-gray-800">1</p>
                      </div>
                      <div>
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Harga</h5>
                        <p className="text-gray-800">{rupiah(defaultData?.vehicle?.price || 0)}</p>
                      </div>
                      <div>
                        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Total</h5>
                        <p className="sm:text-end text-gray-800">{rupiah(defaultData?.vehicle?.price || 0)}</p>
                      </div>
                    </div>
                  </>
                )
            }
          </div>
        </div>
        <div className="mt-8 flex sm:justify-end">
          <div className="w-full max-w-2xl sm:text-end space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 font-semibold text-gray-800">Total:</dt>
                <dd className="col-span-2 text-gray-500">{rupiah(defaultData?.total_price || 0)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <h4 className="text-lg font-semibold text-gray-800">Terimakasih!</h4>
          <p className="text-gray-500">Jika Anda memiliki pertanyaan mengenai invoice ini, gunakan informasi kontak berikut:</p>
          <div className="flex flex-col gap-2 mt-2">
            <p className="block text-sm font-medium text-gray-800"><a href="mailto:desamelung@gmail">desamelung@gmail.com</a></p>
            <p className="block text-sm font-medium text-gray-800"><a href="tel:085647590546">085647590546</a></p>
          </div>
        </div>

        <p className="!mt-5 text-sm text-gray-500">© {new Date().getFullYear()} Desa Wisata Melung</p>
      </div>
      <div className="mt-6 flex justify-end gap-x-3">
        <Link className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm no-underline hover:no-underline" to="/">
          Beranda
        </Link>
        <ButtonToolbar>
          <Button appearance="primary" type="button" onClick={handlePrint} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-primary-Medium-Dark disabled:opacity-50">
            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
            Print
          </Button>
        </ButtonToolbar>
      </div>
      <div style={{ display: "none" }}>
        <TiketMasukPrint ref={componentRef} data={defaultData} />
      </div>
    </>
  )
}

export default TiketMasuk