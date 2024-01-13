import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const tourBookingAPI = `${import.meta.env.VITE_API}/tour/booking`

export const getTourBooking = createAsyncThunk("tourBooking/getTourBooking", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${tourBookingAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const setTourBooking = createAsyncThunk("tourBooking/setTourBooking", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(tourBookingAPI, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

export const updateTourBooking = createAsyncThunk("tourBooking/updateTourBooking", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.put(`${tourBookingAPI}/${data.id}`, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    })

  // const json = await response.json()

  return response
})

export const deleteTourBooking = createAsyncThunk("tourBooking/deleteTourBooking", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${tourBookingAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const tourBookingEntity = createEntityAdapter({
  selectId: (tourBooking) => tourBooking.id
})

const tourBookingSlice = createSlice({
  name: "tourBooking",
  initialState: {
    ...tourBookingEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTourBooking.fulfilled, (state, action) => {
        state.status = "success",
          tourBookingEntity.setAll(state, action.payload.data)
      })
      .addCase(getTourBooking.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getTourBooking.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(setTourBooking.fulfilled, (state, action) => {
        tourBookingEntity.addOne(state, action.payload)
      })
      .addCase(updateTourBooking.fulfilled, (state, action) => {
        tourBookingEntity.updateOne(state, { id: action.payload.id, updates: action.payload })
      })
      .addCase(deleteTourBooking.fulfilled, (state, action) => {
        tourBookingEntity.removeOne(state, action.payload)
      })
  }
})

export const tourBookingSelector = tourBookingEntity.getSelectors(state => state.tourBookingSlice)

export default tourBookingSlice.reducer