import Modal from 'rsuite/Modal'
import Button from 'rsuite/Button'
import { TfiAlert } from 'react-icons/tfi';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Index = ({ openDetail, handleCloseDetail, handleSubmit, load, textButton }) => {
  const cookies = new Cookies()
  const token = cookies.get('token')
  return (
    <>
      <Modal role="alertdialog" open={openDetail} onClose={handleCloseDetail} size="sm">
        {
          token ?
            (
              <>
                <Modal.Body>
                  <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
                  Apakah data anda sudah benar?
                </Modal.Body>
                <Modal.Footer>
                  <Button className='bg-red-500' type="submit" color="red" onClick={handleSubmit} loading={load} appearance="primary">
                    {textButton}
                  </Button>
                  <Button className='bg-slate-100' onClick={handleCloseDetail} appearance="subtle">
                    Cek Kembali
                  </Button>
                </Modal.Footer>
              </>
            )
            :
            (
              <>
                <Modal.Body>
                  <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
                  Anda harus login terlebih dahulu
                </Modal.Body>
                <Modal.Footer>
                  <Link to='/login'>
                    <Button appearance="primary">
                      Login
                    </Button>
                  </Link>
                </Modal.Footer>
              </>
            )
        }
      </Modal>
    </>
  )
}

export default Index