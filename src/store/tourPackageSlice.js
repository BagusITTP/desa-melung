import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const tourPackageAPI = `${import.meta.env.VITE_API}/tours`

export const getTourPackage = createAsyncThunk("tourPackage/getTourPackage", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${tourPackageAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const setTourPackage = createAsyncThunk("tourPackage/setTourPackage", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(tourPackageAPI, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

export const updateTourPackage = createAsyncThunk("tourPackage/updateTourPackage", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const { id, ...rest } = data
  const response = await axios.put(`${tourPackageAPI}/${id}`, rest,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    })

  // const json = await response.json()

  return response
})

export const deleteTourPackage = createAsyncThunk("tourPackage/deleteTourPackage", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${tourPackageAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const tourPackageEntity = createEntityAdapter({
  selectId: (tourPackage) => tourPackage.id
})

const tourPackageSlice = createSlice({
  name: "tourPackage",
  initialState: {
    ...tourPackageEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTourPackage.fulfilled, (state, action) => {
        state.status = "success",
          tourPackageEntity.setAll(state, action.payload.data)
      })
      .addCase(getTourPackage.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getTourPackage.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(setTourPackage.fulfilled, (state, action) => {
        tourPackageEntity.addOne(state, action.payload)
      })
      .addCase(updateTourPackage.fulfilled, (state, action) => {
        tourPackageEntity.updateOne(state, { id: action.payload.id, updates: action.payload })
      })
      .addCase(deleteTourPackage.fulfilled, (state, action) => {
        tourPackageEntity.removeOne(state, action.payload)
      })
  }
})

export const tourPackageSelector = tourPackageEntity.getSelectors(state => state.tourPackageSlice)

export default tourPackageSlice.reducer