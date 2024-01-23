import { FlexboxGrid, Col } from 'rsuite'
import PaketEdukasi from '../../../assets/images/paket-edukasi.webp'
import { Link } from 'react-router-dom'

const Index = () => {
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Paket Wisata</h1>
      </div>
      <section id="option" className="flex justify-center gap-5 py-5">
        <div className="container flex flex-col gap-5 h-full md:h-auto">
          <FlexboxGrid justify='space-around' className="gap-y-2">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={9} lg={9} xl={9}>
              <img className="h-full sm:h-full xl:h-96 max-w-full rounded-t-xl sm:rounded-t-xl md:rounded-s-xl md:rounded-tr-none lg:rounded-s-xl lg:rounded-tr-none xl:rounded-s-xl xl:rounded-tr-none" src={PaketEdukasi} alt="sawah" />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={15} lg={15} xl={15} className="items-center h-full p-0 sm:p-0 md:!px-5 lg:!px-5 xl:p-0">
              <div className="flex flex-col gap-3 w-full h-full justify-center">
                <p className="text-xl">Paket Camping</p>
                <h6 className="text-lg text-secondary">Paket Menginap dirumah warga lokal</h6>
                <p className="text-base line-clamp-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos laborum quidem molestiae magnam possimus quas illum nam quam, ipsam perferendis quis optio facilis ratione eum quo rerum! Doloremque perspiciatis, beatae, laudantium quasi aliquid placeat a non qui earum ducimus ipsa commodi! Explicabo quod, cupiditate quis consequuntur corporis itaque numquam ab.</p>
                <p className="text-2xl text-primary font-bold">Rp. 25.000</p>
                <p className="text-base text-secondary">per 1x makan</p>
                <Link to={"/paket-wisata/1"} className="bg-primary text-white hover:bg-primary-Medium-Dark px-2 py-3 w-fit rounded !no-underline hover:!no-underline">Pesan Sekarang</Link>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
    </>
  )
}

export default Index