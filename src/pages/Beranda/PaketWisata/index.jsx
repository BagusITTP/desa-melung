import { FlexboxGrid, Col, Placeholder } from 'rsuite'
import rupiah from '../../../utils/rupiah'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTourPackage, tourPackageSelector } from '../../../store/tourPackageSlice'

const Index = () => {
  const [defaultData, setDefaultData] = useState([])
  const dispatch = useDispatch()
  const { status } = useSelector(state => state.tourPackageSlice)
  const tourPackage = useSelector(tourPackageSelector.selectAll)

  useEffect(() => {
    dispatch(getTourPackage())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(tourPackage != "Tidak ada data" ? tourPackage : [])
  }, [tourPackage])

  console.log(defaultData)
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Paket Wisata</h1>
      </div>
      <section id="option" className="flex justify-center gap-5 py-5">
        <div className="container flex flex-col gap-5 h-full md:h-auto">
          {
            status === "success"
              ?
              defaultData.map((data, index) => (
                <FlexboxGrid justify='space-around' className="gap-y-2" key={index}>
                  <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={9} lg={9} xl={9} className="!flex !justify-center">
                    <img className="h-full sm:h-full xl:h-96 max-w-full rounded-t-xl sm:rounded-t-xl md:rounded-s-xl md:rounded-tr-none lg:rounded-s-xl lg:rounded-tr-none xl:rounded-s-xl xl:rounded-tr-none object-cover" src={data?.tour_images?.[0]?.url || "https://placehold.co/600x400"} alt="sawah" />
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={15} lg={15} xl={15} className="items-center h-full p-0 sm:p-0 md:!px-5 lg:!px-5 xl:p-0">
                    <div className="flex flex-col gap-3 w-full h-full justify-center">
                      <p className="text-2xl font-bold">{data?.title}</p>
                      <h6 className="text-md text-secondary">{data?.sub_title}</h6>
                      <p className="text-base line-clamp-3">{data?.description}</p>
                      <p className="text-2xl text-primary font-bold">{rupiah(data?.price)}</p>
                      <p className="text-base text-secondary">per {data?.title == "Paket Live In" ? "1x makan" : "orang"}</p>
                      <Link to={`/paket-wisata/${data?.id}`} className="bg-primary text-white hover:bg-primary-Medium-Dark px-2 py-3 w-fit rounded !no-underline hover:!no-underline">Pesan Sekarang</Link>
                    </div>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              ))
              :
              <Placeholder.Paragraph rows={5} graph="image" />
          }
        </div>
      </section>
    </>
  )
}

export default Index