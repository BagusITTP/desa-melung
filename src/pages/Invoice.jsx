import { useSearchParams } from "react-router-dom";
import PaketWisata from "../pages/Invoice/PaketWisata";
import TiketMasuk from "../pages/Invoice/TiketMasuk";

const Invoice = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type")
  return (
    <div className="bg-secondary-Light w-full">
      <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto py-4 sm:py-10">
        <div className="sm:w-11/12 lg:w-3/4 mx-auto">
          {
            type === "paket"
              ?
              <PaketWisata />
              :
              <TiketMasuk />
          }
        </div>
      </div>
    </div>
  )
}

export default Invoice