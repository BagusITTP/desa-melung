import Panel from 'rsuite/Panel';
import Col from 'rsuite/Col';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Placeholder from 'rsuite/Placeholder';
import PaketWisata from '../../../assets/images/paket-wisata.webp';
import PagubuganMelung from '../../../assets/images/pagubugan-melung.webp';
import { BiChevronRight } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { articleSelector, getPageArticle } from '../../../store/articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Savannah from '../../../assets/Savannah.svg';
import Book from '../../../assets/Book.svg';
import People from '../../../assets/People.svg';

const CardList = [
  {
    icon: Savannah,
    title: 'Wisata Alam',
    description: 'Desa yang sejuk dan pemandangan yang indah'
  },
  {
    icon: Book,
    title: 'Edukasi',
    description: 'Dapat belajar kerajinan dan budidaya padi dan sayuran'
  },
  {
    icon: People,
    title: 'Budaya',
    description: 'Budaya yang masih kental dan menarik untuk dipelajari'
  }
]

const Card = ({ data }) => (
  <Panel header={
    <div className="w-full flex justify-center">
      <img src={data.icon} className="w-[30%] sm:w-[20%] md:w-[30%]" />
    </div>
  }>
    <div className="w-full text-center flex flex-col gap-2">
      <h6 className="text-lg">{data.title}</h6>
      <p className="text-base">{data.description}</p>
    </div>
  </Panel>
);

const Index = () => {
  const [defaultData, setDefaultData] = useState([])
  const dispatch = useDispatch()
  const { status } = useSelector(state => state.articleSlice)
  const tourPackage = useSelector(articleSelector.selectAll)

  useEffect(() => {
    dispatch(getPageArticle({ page: 1, limit: 8 }))
  }, [dispatch])

  useEffect(() => {
    setDefaultData(tourPackage?.data != [] ? tourPackage : [])
  }, [tourPackage])
  return (
    <>
      <div className={`w-full bg-[url('/jumbotron.webp')] h-[calc(100vh-4rem)] bg-no-repeat bg-cover bg-bottom`}>
        <div className="flex flex-col gap-3 justify-center items-center w-full h-full backdrop-opacity-10 backdrop-invert bg-black/30">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center ">Desa Wisata Melung</h1>
          <p className="text-white text-lg md:text-xl w-3/4 md:w-1/2 text-center">Manfaatkan liburan kamu untuk melepaskan semua beban agar pikiran dan tubuh menjadi sehat.</p>
        </div>
      </div>
      <section id="serve" className="flex justify-center py-8">
        <div className="container flex flex-col gap-5">
          <h4 className="text-center text-xl lg:text-2xl xl:text-2xl">Apa yang disuguhkan dari Desa Wisata Melung?</h4>
          <FlexboxGrid className="gap-y-2">
            {
              CardList.map((card, index) => (
                <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={8} lg={8} xl={8} key={index}><Card data={card} /></FlexboxGrid.Item>
              ))
            }
          </FlexboxGrid>
        </div>
      </section>
      <section id="order" className="flex justify-center py-8 bg-secondary-Light">
        <div className="container flex flex-col gap-5 h-full md:h-auto">
          <h4 className="text-center text-xl lg:text-2xl xl:text-2xl">Apa yang ditawarkan oleh Desa Wisata Melung?</h4>
          <FlexboxGrid justify='space-around' className="gap-y-2">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12}>
              <LazyLoadImage effect='blur' className="max-w-full rounded-2xl" src={PagubuganMelung} alt="sawah" />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="items-center h-full !px-5">
              <div className="flex flex-col gap-3 w-full h-full justify-center">
                <p className="text-sm text-secondary">Objek Wisata</p>
                <h6 className="text-lg">Pagubugan Melung</h6>
                <p className="text-base">Udara yang sejuk dan pemandangan desa yang masih asri adalah daya tarik wisata Pagubugan Melung ini.</p>
                <Link to={"/tiket-masuk"} className="bg-primary text-white hover:bg-primary-Medium-Dark px-2 py-3 w-fit rounded !no-underline hover:!no-underline">Pesan Sekarang</Link>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <FlexboxGrid justify='space-around' className="gap-y-2">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="items-center h-full !px-5 order-2 md:order-1">
              <div className="flex flex-col gap-3 w-full h-full justify-center">
                <p className="text-sm text-secondary">Paket Wisata</p>
                <h6 className="text-lg">Paket Wisata Melung</h6>
                <p className="text-base">Desa Melung menyediakan paket-paket wisata untuk belajar budidaya tanaman, pelatihan kerajinan, melakukan camping, dan sebagainya.</p>
                <Link to={"/paket-wisata"} className="bg-primary text-white hover:bg-primary-Medium-Dark px-2 py-3 w-fit rounded !no-underline hover:!no-underline">Lihat Semua Paket</Link>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12} className="order-1 md:order-2">
              <LazyLoadImage effect='blur' className="max-w-full rounded-2xl" src={PaketWisata} alt="sawah" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
      <section id="news" className="flex justify-center py-8">
        <div className="container flex flex-col gap-4">
          <div className="flex justify-between w-full">
            <h4 className="text-center text-xl lg:text-2xl xl:text-2xl">Berita Terkini</h4>
            <Link to="/berita" className="flex items-center gap-1 text-primary hover:text-primary-Medium-Dark !no-underline hover:!no-underline">
              <p className="text-sm">Lihat Semua</p>
              <BiChevronRight size={20} />
            </Link>
          </div>
          <FlexboxGrid className="gap-y-4">
            {
              status === "success"
                ?
                defaultData?.length !== 0
                  ?
                  defaultData.map((data, index) =>
                  (
                    <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={8} lg={8} xl={6} className="!overflow-hidden !rounded-md" key={index}>
                      <Link to={`/berita/${data.id}`} className="w-full h-full !no-underline hover:!no-underline !rounded-md !overflow-hidden group">
                        <div className="!h-full !w-full sm:h-full xl:h-full max-w-full max-h-52 object-cover !rounded-md transition ease-in-out delay-150 group-hover:scale-110 duration-300">
                          <LazyLoadImage effect='blur' className="!h-full !w-[130%] sm:h-full xl:h-full max-w-[130%] max-h-52 object-cover !rounded-md" src={data?.article_images?.[0]?.url || "https://placehold.co/800x600"} alt="paket" />
                        </div>
                        <div className="flex flex-col gap-1 w-full pt-2">
                          <h6 className="text-md font-bold group-hover:text-primary">{data?.title}</h6>
                          <p className="text-sm text-secondary">{data?.createAt}</p>
                        </div>
                      </Link>
                    </FlexboxGrid.Item>
                  ))
                  :
                  <h5 className={`w-full !h-60 flex justify-center items-center`}>Belum ada berita</h5>
                :
                <Placeholder.Paragraph rows={5} graph="image" />
            }
          </FlexboxGrid>
        </div>
      </section>
    </>
  )
}

export default Index