import FlexboxGrid from 'rsuite/FlexboxGrid';
import Col from 'rsuite/Col';

const Index = () => {
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Lembaga</h1>
      </div>
      <section id="description" className="flex justify-center gap-5 py-5 bg-secondary-Light">
        <div className="container h-full md:h-auto">
          <FlexboxGrid justify='space-around' className="gap-y-2">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={12} xl={12} className="!px-2">
              <div className="flex flex-col w-full min-h-56 p-3 rounded-lg bg-white">
                <p className="text-xl font-bold">Bumdes</p>
                <p className="text-base">Bumdes Alam Lestari Desa Melung, Kecamatan Kedungbanteng, Kabupaten Banyumas, Jawa Tengah, merupakan salah satu bumdes yang berperan penting dalam pemberdayaan ekonomi masyarakat desa. Bumdes ini didirikan pada tahun 2015 dengan tujuan untuk meningkatkan kesejahteraan masyarakat desa melalui berbagai usaha ekonomi produktif.</p>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={12} xl={12} className="!px-2">
              <div className="flex flex-col w-full min-h-56 p-3 rounded-lg bg-white">
                <p className="text-xl font-bold">Pokdarwis</p>
                <p className="text-base">Kelompok Sadar Wisata (Pokdarwis) Desa Melung merupakan salah satu pokdarwis yang beperan penting dalam pengembangan desa wisata di Desa Melung, Kecamatan Kedungbanteng, Kabupaten Banyumas, Jawa Tengah. Pokdarwis ini didirikan pada tahun 2015 dengan tujuan untuk meningkat peran masyarakat dalam pengembangan desa wisata.</p>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
    </>
  )
}

export default Index