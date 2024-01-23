import { FlexboxGrid, Col } from 'rsuite'
import PaketEdukasi from '../../../assets/images/paket-edukasi.webp'
import { Link } from 'react-router-dom'
import { forwardRef } from 'react';

const NavLink = forwardRef(function NavLink(props, ref) {
  const { href, ...rest } = props;
  return (
    <Link to={href} {...rest} ref={ref}></Link>
  );
});

NavLink.displayName = 'NavLink';

const Index = () => {
  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Berita</h1>
      </div>
      <section id="option" className="flex justify-center gap-5 py-5">
        <div className="container flex flex-col gap-5 h-full md:h-auto">
          <FlexboxGrid as={NavLink} href={`/berita/1`} justify='space-around' className="gap-y-2 group">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={6} lg={6} xl={6} className="!px-1  sm:!px-1 xl:!px-0 overflow-hidden rounded-xl">
              <img className="h-full sm:h-full xl:h-full max-w-full rounded-xl transition ease-in-out delay-150 bg-blue-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-indigo-500 duration-300" src={PaketEdukasi} alt="sawah" />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={17} lg={17} xl={17} className="items-center h-full p-0 sm:p-0 md:!px-5 lg:!px-5 xl:p-0">
              <div className="flex flex-col gap-3 w-full h-full justify-center hover:!no-underline hover:text-primary">
                <h6 className="text-xl font-bold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, quo?</h6>
                <p className="text-sm">20 Desember 2023</p>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
    </>
  )
}

export default Index