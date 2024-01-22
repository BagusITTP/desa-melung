import { Panel, Col, FlexboxGrid } from 'rsuite';
import Savannah from '../../../assets/Savannah.svg';
import Book from '../../../assets/Book.svg';
import People from '../../../assets/People.svg';
import PaketWisata from '../../../assets/images/paket-wisata.webp';
import PagubuganMelung from '../../../assets/images/pagubugan-melung.webp';
import ImageList from '../../../constants/ImageList';
import { Link } from 'react-router-dom';

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
  const chunkSize = 3;

  const imageChunks = [];

  for (let i = 0; i < ImageList.length; i += chunkSize) {
    const chunk = ImageList.slice(i, i + chunkSize);
    imageChunks.push(chunk);
  }
  return (
    <>
      <div className={`w-full bg-[url('/jumbotron.jpeg')] h-[calc(100vh-4rem)] bg-no-repeat bg-cover bg-center`}>
        <div className="flex flex-col gap-3 justify-center items-center w-full h-full backdrop-blur-sm">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center ">Desa Wisata Melung</h1>
          <p className="text-white text-lg md:text-xl w-3/4 md:w-1/2 text-center">Manfaatkan liburan kamu untuk melepaskan semua beban agar pikiran dan tubuh menjadi sehat.</p>
        </div>
      </div>
      <section id="serve" className="flex justify-center py-8">
        <div className="container flex flex-col gap-5">
          <h4 className="text-center text-2xl">Apa yang disuguhkan dari Desa Wisata Melung?</h4>
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
          <h4 className="text-center text-2xl">Apa yang ditawarkan oleh Desa Wisata Melung?</h4>
          <FlexboxGrid justify='space-around' className="gap-y-2">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={12} lg={12} xl={12}>
              <img className="max-w-full rounded-2xl" src={PagubuganMelung} alt="sawah" />
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
              <img className="max-w-full rounded-2xl" src={PaketWisata} alt="sawah" />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
      <section id="gallery" className="flex justify-center py-8">
        <div className="container flex flex-col gap-5">
          <h4 className="text-center text-2xl">Pemandangan Indah dan Serunya Belajar di Desa Wisata Melung</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    </>
  )
}

export default Index