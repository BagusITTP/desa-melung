import { Col, Container, FlexboxGrid, Panel } from "rsuite"
import { MdAccountBalance } from "react-icons/md";
import { MdReceipt } from "react-icons/md";
import { MdPaid } from "react-icons/md";
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getTicketBooking, ticketBookingSelector } from "../../../store/ticketBookingSlice";
import rupiah from "../../../utils/rupiah";

const Card = ({ icon, title, value }) => (
  <Panel className="bg-primary-Green text-white" bordered>
    <FlexboxGrid className="gap-y-2 h-44">
      <FlexboxGrid.Item colspan={24}>
        <div style={{ fontSize: "5em", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item className="text-center" colspan={24}>
        <p className={`${isNaN(value) ? "text-3xl" : "text-4xl"} font-bold`}>{value}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item className="text-center" colspan={24}>
        <p className="text-lg">{title}</p>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  </Panel>
);

const Index = () => {
  const [defaultData, setDefaultData] = useState([]);
  const [data, setData] = useState([
    {
      icon: <MdAccountBalance />,
      title: 'Pesanan Paket Wisata/hari',
      value: 0
    },
    {
      icon: <MdReceipt />,
      title: 'Pesanan Tiket Masuk/hari',
      value: 0
    },
    {
      icon: <MdPaid />,
      title: 'Total Pemasukan/hari',
      value: "Rp. 100.000"
    }
  ]);
  // const dispatch = useDispatch();

  // const ticketBooking = useSelector(ticketBookingSelector.selectAll)

  // useEffect(() => {
  //   dispatch(getTicketBooking())
  // }, [dispatch])

  // useEffect(() => {
  //   setDefaultData(ticketBooking)
  // }, [ticketBooking])

  // setData(prevData => {
  //   const newData = [...prevData];
  //   newData[0] = { ...newData[0], value: 0 };
  //   newData[1] = { ...newData[1], value: 0 };
  //   newData[2] = { ...newData[2], value: "Rp. 0" };
  //   return newData;
  // })

  // const getDate = (dates) => {
  //   const date = new Date(dates);

  //   let day = date.getDate();
  //   let month = date.getMonth() + 1;
  //   let year = date.getFullYear();

  //   return `${day}-${month}-${year}`;
  // }

  // useEffect(() => {
  //   const datasOffline = defaultData?.filter(item => item?.user_id === null && getDate(item?.date) === getDate(new Date().toJSON()))
  //   const totalOffline = datasOffline.length > 0 ? datasOffline.reduce((acc, cur) => acc + (cur?.total_price || 0), 0) : 0;

  //   const datasOnline = defaultData?.filter(item => item?.user_id !== null && getDate(item?.date) === getDate(new Date().toJSON()))
  //   const totalOnline = datasOnline.length > 0 ? datasOnline.reduce((acc, cur) => acc + (cur?.total_price || 0), 0) : 0;

  //   const total = totalOnline + totalOffline

  //   setData(prevData => {
  //     const newData = [...prevData];
  //     newData[0] = { ...newData[0], value: datasOnline.length };
  //     newData[1] = { ...newData[1], value: datasOffline.length };
  //     newData[2] = { ...newData[2], value: rupiah(total) };
  //     return newData;
  //   });

  // }, [defaultData])

  return (
    <>
      <Container className="py-10">
        <FlexboxGrid justify="center" className="gap-4">
          {
            data.map((item, index) => (
              <FlexboxGrid.Item key={index} as={Col} colspan={24} lg={7}>
                <Card icon={item.icon} title={item.title} value={item.value} />
              </FlexboxGrid.Item>
            ))
          }
        </FlexboxGrid>
      </Container>
    </>
  )
}

export default Index