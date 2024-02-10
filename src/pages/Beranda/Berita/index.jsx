import { FlexboxGrid, Col, Placeholder, Pagination } from 'rsuite'
import { Link } from 'react-router-dom'
import { forwardRef, useEffect, useState } from 'react';
import { getPageArticle } from '../../../store/articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../../../utils/formatDate';

const NavLink = forwardRef(function NavLink(props, ref) {
  const { href, ...rest } = props;
  return (
    <Link to={href} {...rest} ref={ref}></Link>
  );
});

NavLink.displayName = 'NavLink';

const Index = () => {
  const [defaultData, setDefaultData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const { status } = useSelector(state => state.articleSlice)

  useEffect(() => {
    dispatch(getPageArticle({ page, limit: 10 })).then(({ payload }) => {
      setDefaultData(payload?.data)
      setTotal(payload?.total)
    })
  }, [dispatch, page])

  return (
    <>
      <div className="bg-primary text-white w-full h-44 flex justify-center items-center">
        <h1 className="text-3xl font-bold border-b-4 border-b-white">Berita</h1>
      </div>
      <section id="option" className="flex justify-center gap-5 py-5">
        <div className="container flex flex-col gap-5 h-full md:h-auto">
          {
            defaultData?.length !== 0
              ?
              status === "success"
                ?
                <>
                  {
                    defaultData?.map((data, index) => (
                      <div className="w-full flex flex-col justify-center gap-4" key={index}>
                        <FlexboxGrid as={NavLink} href={`/berita/${data.id}`} justify='space-around' className="gap-y-2 group">
                          <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={6} lg={6} xl={6} className="!px-1 sm:!px-1 xl:!px-0 overflow-hidden rounded-xl">
                            <img className="max-h-80 object-cover rounded-xl transition ease-in-out delay-150 group-hover:-translate-y-1 group-hover:scale-110 duration-300" src={data?.article_images?.[0]?.url || "https://placehold.co/800x600"} alt="sawah" loading='lazy' />
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={17} lg={17} xl={17} className="items-center h-full p-0 sm:p-0 md:!px-5 lg:!px-5 xl:p-0">
                            <div className="flex flex-col gap-3 w-full h-full justify-center hover:!no-underline hover:text-primary">
                              <h6 className="text-xl font-bold">{data?.title}</h6>
                              <p className="text-sm">{formatDate(data?.createdAt)}</p>
                            </div>
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </div>
                    ))
                  }
                  <Pagination
                    prev
                    last
                    next
                    first
                    size="xs"
                    total={total}
                    limit={10}
                    activePage={page}
                    onChangePage={setPage}
                  />
                </>
                :
                <Placeholder.Paragraph rows={5} graph="image" />
              :
              <h5 className={`w-full !h-96 flex justify-center items-center`}>Belum ada berita</h5>
          }
        </div>
      </section>
    </>
  )
}

export default Index