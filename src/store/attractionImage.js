import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const attractionImageAPI = `${import.meta.env.VITE_API}/attraction/image`

export const deleteAttractionImage = createAsyncThunk("attractionImage/deleteAttractionImage", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${attractionImageAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const attractionImageEntity = createEntityAdapter({
  selectId: (attractionImage) => attractionImage.id
})

const attractionImageSlice = createSlice({
  name: "attractionImage",
  initialState: {
    ...attractionImageEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteAttractionImage.fulfilled, (state, action) => {
        attractionImageEntity.removeOne(state, action.payload)
      })
  }
})

export const attractionImageSelector = attractionImageEntity.getSelectors(state => state.attractionImageSlice)

export default attractionImageSlice.reducer