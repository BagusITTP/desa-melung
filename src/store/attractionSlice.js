import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const attractionAPI = `${import.meta.env.VITE_API}/attractions`

export const getAttraction = createAsyncThunk("attraction/getAttraction", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${attractionAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const updateAttraction = createAsyncThunk("attraction/updateAttraction", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.put(`${attractionAPI}/1`, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    })

  // const json = await response.json()

  return response
})

const attractionEntity = createEntityAdapter({
  selectId: (attraction) => attraction.id
})

const attractionSlice = createSlice({
  name: "attraction",
  initialState: {
    ...attractionEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttraction.fulfilled, (state, action) => {
        state.status = "success",
          attractionEntity.setAll(state, action.payload.data)
      })
      .addCase(getAttraction.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getAttraction.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(updateAttraction.fulfilled, (state, action) => {
        attractionEntity.updateOne(state, { id: action.payload.id, updates: action.payload })
      })
  }
})

export const attractionSelector = attractionEntity.getSelectors(state => state.attractionSlice)

export default attractionSlice.reducer