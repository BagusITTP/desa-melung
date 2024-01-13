import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const vehicleAPI = `${import.meta.env.VITE_API}/vehicles`

export const getVehicle = createAsyncThunk("vehicle/getVehicle", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${vehicleAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const deleteVehicle = createAsyncThunk("vehicle/deleteVehicle", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${vehicleAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const vehicleEntity = createEntityAdapter({
  selectId: (vehicle) => vehicle.id
})

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    ...vehicleEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.status = "success",
          vehicleEntity.setAll(state, action.payload.data)
      })
      .addCase(getVehicle.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getVehicle.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        vehicleEntity.removeOne(state, action.payload)
      })
  }
})

export const vehicleSelector = vehicleEntity.getSelectors(state => state.vehicleSlice)

export default vehicleSlice.reducer