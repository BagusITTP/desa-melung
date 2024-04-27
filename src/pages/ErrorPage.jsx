import errorImg from '../assets/images/404.svg'
import IconButton from "rsuite/IconButton";
import { BiChevronLeft } from 'react-icons/bi';
import { useRouteError } from 'react-router-dom';
import Forbidden from '../assets/images/403.svg'

const ErrorPage = () => {
  const error = useRouteError()
  const text = error?.statusText ? error?.statusText.split(",") : []
  // console.log(error);
  return (
    <>
      <div className="error-page">
        <div className="item">
          <img src={error?.status === 403 ? Forbidden : errorImg} />
          <div className="text">
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{error?.status}</h1>
            <p className="error-page-title">{text[0] !== "Not Found" ? text[0] : "Oops… Kamu hanya menemukan halaman kosong"}</p>
            <p className="error-page-subtitle text-muted ">
              {text[1] ? text[1] : "Maaf halaman yang anda cari tidak kami temukan"}
            </p>
            <IconButton icon={<BiChevronLeft />} appearance="primary" href="/">
              Kembali ke dashboard
            </IconButton>
            {/* {children} */}
          </div>
        </div>
      </div>
    </>
  )
  // const error = useRouteError();
  // console.error(error);

  // return (
  //   <div id="error-page">
  //     <h1>Oops!</h1>
  //     <p>Sorry, an unexpected error has occurred.</p>
  //     <p>
  //       <i>{error.statusText || error.message}</i>
  //     </p>
  //   </div>
  // );
}

export default ErrorPage