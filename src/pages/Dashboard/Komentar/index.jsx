import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "rsuite/Breadcrumb";
import Button from "rsuite/Button";
import DOMHelper from "rsuite/DOMHelper";
import Input from "rsuite/Input";
import InputGroup from "rsuite/InputGroup";
import Modal from "rsuite/Modal";
import Pagination from "rsuite/Pagination";
import Panel from "rsuite/Panel";
import List from "rsuite/List";
import Stack from "rsuite/Stack";
import Table from "rsuite/Table";
import { BiSearch } from "react-icons/bi";
import { BiSolidDetail } from "react-icons/bi";
import 'react-toastify/dist/ReactToastify.css';
import { getComment, commentSelector } from "../../../store/commentSlice";

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;
const Index = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [defaultData, setDefaultData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();

  const [headerDetail, setHeaderDetail] = useState();
  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const handleCloseDetail = () => setOpenDetail(false);

  const dispatch = useDispatch()
  const { status } = useSelector(state => state.commentSlice)
  const comment = useSelector(commentSelector.selectAll)

  useEffect(() => {
    dispatch(getComment())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(comment != "Tidak ada data" ? comment : [])
  }, [comment])

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
      if (item?.title?.toLowerCase() != undefined && !item?.title?.toLowerCase().includes(searchKeyword.toLowerCase())) {
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

  const handleOpenDetail = (data, header) => {
    setDataDetail(data)
    setHeaderDetail(header)
    setOpenDetail(true)
  };

  return (
    <>
      <Panel
        header={
          <>
            <Breadcrumb>
              <Breadcrumb.Item>Daftar Komentar</Breadcrumb.Item>
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
          autoHeight
          rowHeight={50}
          loading={status == "pending"}
        >
          <Column width={50} align="center">
            <HeaderCell>No</HeaderCell>
            <Cell>{(rowData, index) => index + 1}</Cell>
          </Column>

          <Column width={150} fixed >
            <HeaderCell>Berita</HeaderCell>
            <Cell dataKey="title">{rowData => `${rowData?.article?.title}`}</Cell>
          </Column>

          <Column width={200} >
            <HeaderCell>Nama</HeaderCell>
            <Cell>{rowData => `${rowData?.name}`}</Cell>
          </Column>

          <Column width={120}>
            <HeaderCell>No Telepon</HeaderCell>
            <Cell>{rowData => `${rowData?.phone_number}`}</Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Pesan</HeaderCell>
            <Cell>{rowData => `${rowData?.message}`}</Cell>
          </Column>

          <Column width={50} align="center">
            <HeaderCell>Action</HeaderCell>
            <Cell style={{ padding: '6px' }}>
              {rowData => (
                <div className='flex place-content-center gap-1'>
                  <Button className='hover:!bg-blue-500 group' onClick={() => handleOpenDetail(rowData, rowData.title)}>
                    <BiSolidDetail className='group-hover:text-white' />
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

        <Modal role="alertdialog" open={openDetail} onClose={handleCloseDetail} size="md">
          <Modal.Header>
            <Modal.Title>Detail {headerDetail}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <List bordered>
              <List.Item>{dataDetail?.article?.title}</List.Item>
              <List.Item>{dataDetail?.name}</List.Item>
              <List.Item>{dataDetail?.phone_number}</List.Item>
              <List.Item>{dataDetail?.message}</List.Item>
            </List>
          </Modal.Body>
        </Modal>
      </Panel>
    </>
  )
}

export default Index