import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const ticketBookingAPI = `${import.meta.env.VITE_API}/ticket/booking`

export const getTicketBooking = createAsyncThunk("ticketBooking/getTicketBooking", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${ticketBookingAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const getUserTicketBooking = createAsyncThunk("ticketBooking/getUserTicketBooking", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${ticketBookingAPI}/user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const getOrderIdTicket = createAsyncThunk("ticketBooking/getOrderIdTicket", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${ticketBookingAPI}/order?order_id=${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const getPaymentTicket = createAsyncThunk("ticketBooking/getPaymentTicket", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(`${ticketBookingAPI}/payment/success`, data,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

export const setTicketBooking = createAsyncThunk("ticketBooking/setTicketBooking", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(ticketBookingAPI, data,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

export const deleteTicketBooking = createAsyncThunk("ticketBooking/deleteTicketBooking", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${ticketBookingAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const ticketBookingEntity = createEntityAdapter({
  selectId: (ticketBooking) => ticketBooking.id
})

const ticketBookingSlice = createSlice({
  name: "ticketBooking",
  initialState: {
    ...ticketBookingEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTicketBooking.fulfilled, (state, action) => {
        state.status = "success",
          ticketBookingEntity.setAll(state, action.payload.data)
      })
      .addCase(getTicketBooking.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getTicketBooking.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(getUserTicketBooking.fulfilled, (state, action) => {
        state.status = "success",
          ticketBookingEntity.setAll(state, action.payload.data)
      })
      .addCase(getUserTicketBooking.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getUserTicketBooking.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(getOrderIdTicket.fulfilled, (state, action) => {
        state.status = "success",
          ticketBookingEntity.setAll(state, action.payload.data)
      })
      .addCase(getOrderIdTicket.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getOrderIdTicket.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(getPaymentTicket.fulfilled, (state, action) => {
        ticketBookingEntity.addOne(state, action.payload)
      })
      .addCase(setTicketBooking.fulfilled, (state, action) => {
        ticketBookingEntity.addOne(state, action.payload)
      })
      .addCase(deleteTicketBooking.fulfilled, (state, action) => {
        ticketBookingEntity.removeOne(state, action.payload)
      })
  }
})

export const ticketBookingSelector = ticketBookingEntity.getSelectors(state => state.ticketBookingSlice)

export default ticketBookingSlice.reducer