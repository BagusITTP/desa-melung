import { Col, Container, FlexboxGrid, Panel } from "rsuite"
import { MdAccountBalance } from "react-icons/md";
import { MdReceipt } from "react-icons/md";
import { MdPaid } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard, tourBookingSelector } from "../../../store/tourBookingSlice";
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
  const dispatch = useDispatch();

  const dashboard = useSelector(tourBookingSelector.selectAll)

  useEffect(() => {
    dispatch(getDashboard())
  }, [dispatch])

  useEffect(() => {
    setDefaultData(dashboard)
  }, [dashboard])

  useEffect(() => {
    setData(prevData => {
      const newData = [...prevData];
      newData[0] = { ...newData[0], value: defaultData[0]?.tourBooking ? defaultData[0]?.tourBooking : 0 };
      newData[1] = { ...newData[1], value: defaultData[0]?.ticketBooking ? defaultData[0]?.ticketBooking : 0 };
      newData[2] = { ...newData[2], value: rupiah(defaultData[0]?.total ? defaultData[0]?.total : 0) };
      return newData;
    });
  }, [defaultData])

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