import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const contactAPI = `${import.meta.env.VITE_API}/contacts`

export const getContact = createAsyncThunk("contact/getContact", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${contactAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const setContact = createAsyncThunk("contact/setContact", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(contactAPI, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

const contactEntity = createEntityAdapter({
  selectId: (contact) => contact.id
})

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    ...contactEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContact.fulfilled, (state, action) => {
        state.status = "success",
          contactEntity.setAll(state, action.payload.data)
      })
      .addCase(getContact.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getContact.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(setContact.fulfilled, (state, action) => {
        contactEntity.addOne(state, action.payload)
      })
  }
})

export const contactSelector = contactEntity.getSelectors(state => state.contactSlice)

export default contactSlice.reducer