import FlexboxGrid from 'rsuite/FlexboxGrid';
import Col from 'rsuite/Col';
import Carousel from 'rsuite/Carousel';
import Form from 'rsuite/Form';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Schema from 'rsuite/Schema';
import Checkbox from 'rsuite/Checkbox';
import CheckboxGroup from 'rsuite/CheckboxGroup';
import Input from 'rsuite/Input';
import Message from 'rsuite/Message';
import Placeholder from 'rsuite/Placeholder';
import Pagination from 'rsuite/Pagination';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, FacebookShareCount, TelegramIcon, TelegramShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { articleSelector, getArticle, getPageArticle } from '../../../store/articleSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import formatDate from '../../../utils/formatDate'
import Cookies from 'universal-cookie'
import { jwtDecode } from 'jwt-decode'
import optionToast from '../../../constants/optionToast';
import { toast } from 'react-toastify'
import { getPageComment, setComment } from '../../../store/commentSlice';

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired("Nama harus diisi"),
  phone_number: StringType().isRequired("Nomor telepon harus diisi"),
  message: StringType().isRequired("Pesan harus diisi"),
});

const Textarea = forwardRef(function Textarea(props, ref) {
  return <Input {...props} ref={ref} as="textarea" />;
});

Textarea.displayName = 'Textarea';

const Index = () => {
  const formRef = useRef();
  const [formValue, setFormValue] = useState({
    name: "",
    phone_number: "",
    message: ""
  });
  const [defaultData, setDefaultData] = useState([])
  const [datas, setDatas] = useState([])
  const [lists, setLists] = useState([])
  const [page, setPage] = useState(1)
  const [load, setLoad] = useState(false)
  const [checked, setChecked] = useState([])
  const dispatch = useDispatch()
  const cookies = new Cookies()
  const token = cookies.get('token');
  const [dataToken] = useState(() => {
    if (token) {
      return jwtDecode(token);
    }
    return null;
  });

  useEffect(() => {
    setFormValue({
      name: dataToken?.name || "",
      phone_number: dataToken?.phone_number || "",
      message: ""
    })
  }, [dataToken])
  const { id } = useParams()

  const { status } = useSelector(state => state.commentSlice)
  const articles = useSelector((state) => articleSelector.selectById(state, id))

  useEffect(() => {
    dispatch(getArticle())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(articles || [])
  }, [articles])

  useEffect(() => {
    dispatch(getPageComment({ id, page, limit: 5 })).then(({ payload }) => setDatas([{ data: payload?.data, total: payload?.total }]))
  }, [dispatch, id, page])

  useEffect(() => {
    dispatch(getPageArticle({ page: 1, limit: 5 })).then(({ payload }) => setLists(payload?.data))
  }, [dispatch])

  console.log(lists)

  const item = sessionStorage.getItem('checked')
  useEffect(() => {
    let items = JSON.parse(item)
    if (item) {
      setFormValue({
        name: items?.name || "",
        phone_number: items?.phone_number || "",
        message: ""
      })
    }
  }, [item])

  const location = useLocation()
  const { pathname } = location
  const title = defaultData?.title
  const str = defaultData?.description

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current.check()) {
      setLoad(true);

      try {
        const res = await dispatch(setComment({ article_id: id, ...formValue }));
        const { name, phone_number } = formValue;

        if (res.payload.data.status === "success") {
          if (checked.length > 0 && item === null) {
            sessionStorage.setItem("checked", JSON.stringify({ name, phone_number }));
          }
          toast.success(res.payload.data.message, optionToast);
          setLoad(false);
          dispatch(getArticle());
          dispatch(getPageComment({ id, page, limit: 5 }));
          if (dataToken == null || item == null) {
            setFormValue({
              name: "",
              phone_number: "",
              message: ""
            });
          }
        } else {
          setLoad(false);
          toast.error(res.payload.data.message, optionToast);
        }
      } catch (err) {
        setLoad(false);
        toast.error(`Terjadi kesalahan`, optionToast);
      }
    } else {
      toast.error(`Perisa kembali inputan anda`, optionToast);
    }
  }

  return (
    <>
      <Helmet>
        <title>{`${title} | Berita`}</title>
        <meta name="description" content={str?.split('.').slice(0, 3).join('.')} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={str?.split('.').slice(0, 3).join('.')} />
        <meta property="og:image" content={defaultData?.article_images?.[0]?.url} />
        <meta property="og:url" content={pathname} />
      </Helmet>
      <div className="bg-primary text-white w-full h-44 flex flex-col justify-center items-center">
        <h1 className="text-lg md:text-xl lg:text-2xl text-center font-bold px-2 sm:px-24 md:px-32 lg:px-44 xl:px-56 leading-relaxed">{title}</h1>
        <p className="text-base text-secondary-Light">{formatDate(defaultData?.createdAt)}</p>
      </div>
      <section id="description" className="flex justify-center gap-5 py-5 bg-secondary-Light">
        <div className="px-2 h-full md:h-auto">
          <FlexboxGrid justify='space-around' className="gap-y-2">
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={17} className="!flex !flex-col gap-5">
              <div className="!p-6 flex flex-col w-full h-full gap-4 bg-white rounded">
                <Carousel autoplay autoplayInterval={5000} className="custom-slider !object-cover !h-[500px]">
                  {defaultData?.article_images?.map((item, index) => (
                    <div key={index}>
                      <img src={item.url} alt="gambar berita" className="!object-cover !h-full !w-full" />
                    </div>
                  ))}
                </Carousel>
                <p className="text-base leading-loose tracking-wide">
                  <div dangerouslySetInnerHTML={{ __html: str }} />
                </p>
                <p className="text-xl font-bold">Bagikan Berita</p>
                <div className="flex gap-2">
                  <div className="Demo__some-network">
                    <FacebookShareButton
                      url={pathname}
                      className="Demo__some-network__share-button"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <div>
                      <FacebookShareCount
                        url={pathname}
                        className="Demo__some-network__share-count"
                      >
                        {(count) => count}
                      </FacebookShareCount>
                    </div>
                  </div>
                  <div className="Demo__some-network">
                    <WhatsappShareButton
                      url={pathname}
                      title={title}
                      separator=":: "
                      className="Demo__some-network__share-button"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>
                  <div className="Demo__some-network">
                    <TwitterShareButton
                      url={pathname}
                      title={title}
                      className="Demo__some-network__share-button"
                    >
                      <XIcon size={32} round />
                    </TwitterShareButton>
                  </div>
                  <div className="Demo__some-network">
                    <TelegramShareButton
                      url={pathname}
                      title={title}
                      className="Demo__some-network__share-button"
                    >
                      <TelegramIcon size={32} round />
                    </TelegramShareButton>
                  </div>
                  <div className="Demo__some-network">
                    <EmailShareButton
                      url={pathname}
                      subject={title}
                      body="body"
                      className="Demo__some-network__share-button"
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </div>
                </div>
              </div>
              <div className="!p-6 flex flex-col w-full h-full gap-1 bg-white rounded">
                <h5 className="text-xl font-bold">{datas?.[0]?.total} Komentar</h5>
                <div className="flex flex-col gap-4 mt-4">
                  {
                    status === "success"
                      ?
                      (
                        <>
                          {
                            datas?.[0]?.data?.map((item, index) => (
                              <div className="flex flex-col" key={index}>
                                <h6 className="text-lg font-bold">{item?.name}</h6>
                                <p className="text-sm text-secondary">{formatDate(item?.createdAt)}</p>
                                <p className="text-base tracking-wide leading-relaxed mt-2">{item?.message}</p>
                              </div>
                            ))
                          }
                          <Pagination
                            prev
                            last
                            next
                            first
                            size="xs"
                            total={datas?.[0]?.total}
                            limit={5}
                            activePage={page}
                            onChangePage={setPage}
                          />
                        </>
                      )
                      :
                      <Placeholder.Paragraph rows={5} />
                  }
                </div>
              </div>
              <div className="!p-6 flex flex-col w-full h-full gap-1 bg-white rounded">
                <h5 className="text-xl font-bold">Kirim Komentar</h5>
                {
                  item != null
                    ?
                    (
                      <Message showIcon type="warning" header="Perhatian">
                        Jika Anda ingin merubah nama dan no telepon, bisa klik tombol ini.
                        <Button onClick={() => {
                          sessionStorage.removeItem("checked")
                          window.location.reload()
                        }} className="!ml-2" appearance="primary">Ubah Data</Button>
                      </Message>
                    )
                    :
                    (
                      <p className="text-sm text-secondary">No Telepon anda tidak akan di publikasi.</p>
                    )
                }
                <Form
                  ref={formRef}
                  formValue={formValue}
                  model={model}
                  encType="multipart/form-data"
                  fluid
                  className="mt-2"
                >
                  <Form.Group controlId="nama" className="!my-2">
                    <Form.ControlLabel>Nama Lengkap</Form.ControlLabel>
                    <Form.Control
                      name="name"
                      errorPlacement='bottomEnd'
                      placeholder="Nama Anda"
                      disabled={load || dataToken != null || item != null}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          name: e
                        })
                      }}
                    />
                    <Form.HelpText>Nama Lengkap harus diisi</Form.HelpText>
                  </Form.Group>
                  <Form.Group controlId="no" className="!my-2">
                    <Form.ControlLabel>No Telepon</Form.ControlLabel>
                    <Form.Control
                      name="phone_number"
                      errorPlacement='bottomEnd'
                      placeholder="cth. 081234567890"
                      disabled={load || dataToken != null || item != null}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          phone_number: e
                        })
                      }}
                    />
                    <Form.HelpText>No Telepon harus diisi</Form.HelpText>
                  </Form.Group>
                  <Form.Group controlId="komentar" className="!my-2">
                    <Form.ControlLabel>Komentar</Form.ControlLabel>
                    <Form.Control
                      accepter={Textarea}
                      rows={3}
                      name="message"
                      errorPlacement='bottomEnd'
                      placeholder="Komentar Anda"
                      disabled={load}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          message: e
                        })
                      }}
                    />
                    <Form.HelpText>Komentar harus diisi</Form.HelpText>
                  </Form.Group>
                  {
                    dataToken != null || item != null
                      ? ""
                      :
                      (
                        <CheckboxGroup
                          inline
                          name="checkboxList"
                          value={checked}
                          onChange={check => setChecked(check)}
                        >
                          <Checkbox value="save" className="mb-2">Simpan Nama dan No Telepon saya pada browser saya ini untuk komentar saya berikutnya.</Checkbox>
                        </CheckboxGroup>
                      )
                  }
                  <ButtonToolbar>
                    <Button appearance="primary" loading={load} type="submit" onClick={handleSubmit}>
                      Kirim
                    </Button>
                  </ButtonToolbar>
                </Form>
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} colspan={24} xs={24} sm={24} md={24} lg={24} xl={6} className="!px-2 !sticky !top-20">
              <div className="flex flex-col w-full min-h-56 px-6 py-4 rounded bg-white">
                <p className="text-xl font-bold">Berita</p>
                <ul role="list" className="pt-2 divide-y divide-slate-200">
                  {
                    lists.map((list, index) => (
                      (
                        <li className="py-2 first:pt-0 last:pb-0 hover:text-primary" key={index}>
                          <Link to={`/berita/${list?.id}`} className="flex flex-col gap-1 !no-underline hover:!no-underline">
                            <h6 className="text-base font-bold">{list?.title}</h6>
                            <p className="text-sm text-secondary">{formatDate(list?.createdAt)}</p>
                          </Link>
                        </li>
                      )
                    ))
                  }
                </ul>
              </div>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </section>
    </>
  )
}

export default Index