import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const commentAPI = `${import.meta.env.VITE_API}/comments`

export const getComment = createAsyncThunk("comment/getComment", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${commentAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const setComment = createAsyncThunk("comment/setComment", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(commentAPI, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

export const deleteComment = createAsyncThunk("comment/deleteComment", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${commentAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const commentEntity = createEntityAdapter({
  selectId: (comment) => comment.id
})

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    ...commentEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComment.fulfilled, (state, action) => {
        state.status = "success",
          commentEntity.setAll(state, action.payload.data)
      })
      .addCase(getComment.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getComment.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(setComment.fulfilled, (state, action) => {
        commentEntity.addOne(state, action.payload)
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        commentEntity.removeOne(state, action.payload)
      })
  }
})

export const commentSelector = commentEntity.getSelectors(state => state.commentSlice)

export default commentSlice.reducer