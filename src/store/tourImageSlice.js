import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const tourImageAPI = `${import.meta.env.VITE_API}/tour/image`

export const getTourImage = createAsyncThunk("tourImage/getTourImage", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${tourImageAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const deleteTourImage = createAsyncThunk("tourImage/deleteTourImage", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${tourImageAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const tourImageEntity = createEntityAdapter({
  selectId: (tourImage) => tourImage.id
})

const tourImageSlice = createSlice({
  name: "tourImage",
  initialState: {
    ...tourImageEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTourImage.fulfilled, (state, action) => {
        state.status = "success",
          tourImageEntity.setAll(state, action.payload.data)
      })
      .addCase(getTourImage.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getTourImage.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(deleteTourImage.fulfilled, (state, action) => {
        tourImageEntity.removeOne(state, action.payload)
      })
  }
})

export const tourImageSelector = tourImageEntity.getSelectors(state => state.tourImageSlice)

export default tourImageSlice.reducer