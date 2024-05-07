import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "rsuite/Breadcrumb"
import Button from "rsuite/Button";
import DOMHelper from "rsuite/DOMHelper";
import Input from "rsuite/Input";
import InputGroup from "rsuite/InputGroup";
import Modal from "rsuite/Modal";
import Pagination from "rsuite/Pagination";
import Panel from "rsuite/Panel";
import Stack from "rsuite/Stack";
import Table from "rsuite/Table";
import { toast } from "react-toastify";
import { BiSearch, BiTrash, BiSolidPlusSquare, BiSolidMinusSquare } from "react-icons/bi";
import { TfiAlert } from "react-icons/tfi";
import 'react-toastify/dist/ReactToastify.css';
import { deleteTourBooking, getTourBooking, tourBookingSelector } from "../../../../store/tourBookingSlice";
import optionToast from "../../../../constants/optionToast";
import rupiah from "../../../../utils/rupiah";
import formatDate from "../../../../utils/formatDate";

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

const rowKey = 'id';

const ExpandCell = ({ rowData, expandedRowKeys, onChange, ...props }) => (
  <Cell {...props} style={{ padding: 5 }}>
    <Button
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
    >
      {expandedRowKeys.some(key => key === rowData[rowKey]) ? (
        <BiSolidMinusSquare style={{ fontSize: "1.2em" }} />
      ) : (
        <BiSolidPlusSquare style={{ fontSize: "1.2em" }} />
      )}
    </Button>
  </Cell>
);

const renderRowExpanded = rowData => {
  let payment_status = rowData?.payment_status

  switch (payment_status) {
    case "success":
      payment_status = "Dibayar"
      break
    case "waiting":
      payment_status = "Menunggu Pembayaran"
      break
    default:
      payment_status = "Dibatalkan"
      break
  }
  return (
    <div className="flex gap-6 ms-5">
      <div>
        <p>Email: {rowData?.user?.email}</p>
        <p>Jumlah Orang: {rowData?.amount} orang</p>
        <p>Status Pembayaran: {payment_status}</p>
      </div>
      {
        rowData?.tour_package?.title == "Paket Live In" &&
        (
          <div>
            <p>Tanggal Datang: {formatDate(rowData?.arrival_date)}</p>
            <p>Tanggal Pulang: {formatDate(rowData?.departure_date)}</p>
            <p>Jumlah Makan: {rowData?.meal_count}x</p>
          </div>
        )
      }
    </div>
  );
};

const Index = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [defaultData, setDefaultData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [load, setLoad] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [headerDelete, setHeaderDelete] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const handleCloseDelete = () => setOpenDelete(false);

  const dispatch = useDispatch()
  const { status } = useSelector(state => state.tourBookingSlice)
  const tourBooking = useSelector(tourBookingSelector.selectAll)

  useEffect(() => {
    dispatch(getTourBooking())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(tourBooking != "Tidak ada data" ? tourBooking : [])
  }, [tourBooking])

  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = defaultData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    const filtered = data.filter(item => {
      if (item?.user?.name?.toLowerCase() != undefined && !item?.user?.name?.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }

      return true;
    });

    if (sortColumn && sortType) {
      return filtered.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        if (typeof x === 'string') {
          x = x.charCodeAt(0);
        }
        if (typeof y === 'string') {
          y = y.charCodeAt(0);
        }

        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return filtered;
  };

  const handleOpenDelete = (id, header) => {
    setIdDelete(id)
    setHeaderDelete(header)
    setOpenDelete(true)
  };

  const handleDelete = async () => {
    setLoad(true)
    const res = await dispatch(deleteTourBooking(idDelete))
    setOpenDelete(false)
    await dispatch(getTourBooking())
    setLoad(false)
    toast.success(res.payload.message, optionToast);
  }

  const handleExpanded = (rowData,) => {
    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach(key => {
      if (key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }

    setExpandedRowKeys(nextExpandedRowKeys);
  };

  return (
    <>
      <Panel
        header={
          <>
            <Breadcrumb>
              <Breadcrumb.Item>Daftar Pesanan Paket Wisata</Breadcrumb.Item>
            </Breadcrumb>
          </>
        }
      >
        <Stack className='flex justify-end mb-5' spacing={6}>
          <InputGroup inside>
            <Input placeholder="Search" value={searchKeyword} onChange={setSearchKeyword} />
            <InputGroup.Addon>
              <BiSearch />
            </InputGroup.Addon>
          </InputGroup>
        </Stack>
        <Table
          height={Math.max(getHeight(window) - 200, 400)}
          data={filteredData()}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          // wordWrap="break-words"
          rowKey={rowKey}
          expandedRowKeys={expandedRowKeys}
          renderRowExpanded={renderRowExpanded}
          loading={status == "pending"}
        >
          <Column width={50} align="center">
            <HeaderCell>No</HeaderCell>
            <Cell>{(rowData, index) => index + 1}</Cell>
          </Column>

          <Column width={180} fullText>
            <HeaderCell>Order ID</HeaderCell>
            <Cell>{rowData => `${rowData?.midtrans_booking_code}`}</Cell>
          </Column>

          <Column flexGrow={1} fullText>
            <HeaderCell>Tanggal Pemesanan</HeaderCell>
            <Cell>{rowData => `${formatDate(rowData?.createdAt)}`}</Cell>
          </Column>

          <Column width={140} fullText >
            <HeaderCell>Paket</HeaderCell>
            <Cell dataKey="title">{rowData => `${rowData?.tour_package?.title}`}</Cell>
          </Column>

          <Column width={260} fullText>
            <HeaderCell>Nama Pemesan</HeaderCell>
            <Cell>{rowData => `${rowData?.user?.name}`}</Cell>
          </Column>

          <Column width={130}>
            <HeaderCell>Total</HeaderCell>
            <Cell>{rowData => `${rupiah(rowData?.total_price)}`}</Cell>
          </Column>

          <Column width={50} align="center">
            <HeaderCell>Detail</HeaderCell>
            <ExpandCell dataKey="id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded} />
          </Column>

          <Column width={50} align="center">
            <HeaderCell>Action</HeaderCell>
            <Cell style={{ padding: '6px' }}>
              {rowData => (
                <div className='flex place-content-center gap-1'>
                  <Button className='hover:!bg-red-500 group' onClick={() => handleOpenDelete(rowData.id, rowData.midtrans_booking_code)}>
                    <BiTrash className='group-hover:text-white' />
                  </Button>
                </div>
              )}
            </Cell>
          </Column>

        </Table>
        <div style={{ padding: 20 }}>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
            total={defaultData.length}
            limitOptions={[10, 30, 50]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>

        <Modal backdrop="static" role="alertdialog" open={openDelete} onClose={handleCloseDelete} size="xs">
          <Modal.Body>
            <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
            Apakah kamu yakin untuk menghapus pesanan dengan order id <span className="font-bold">{headerDelete}</span> ini?
          </Modal.Body>
          <Modal.Footer>
            <Button className='bg-red-500' color="red" onClick={handleDelete} loading={load} appearance="primary">
              Hapus
            </Button>
            <Button className='bg-slate-100' onClick={handleCloseDelete} appearance="subtle">
              Batal
            </Button>
          </Modal.Footer>
        </Modal>
      </Panel>
    </>
  )
}

export default Index