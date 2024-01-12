import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const articleAPI = `${import.meta.env.VITE_API}/articles`

export const getArticle = createAsyncThunk("article/getArticle", async () => {
  const cookies = new Cookies()
  let token = cookies.get("token")

  const response = await fetch(`${articleAPI}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

export const setArticle = createAsyncThunk("article/setArticle", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.post(articleAPI, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
      body: data
    })

  return response
})

export const updateArticle = createAsyncThunk("article/updateArticle", async (data) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await axios.put(`${articleAPI}/${data.id}`, data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    })

  // const json = await response.json()

  return response
})

export const deleteArticle = createAsyncThunk("article/deleteArticle", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${articleAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const articleEntity = createEntityAdapter({
  selectId: (article) => article.id
})

const articleSlice = createSlice({
  name: "article",
  initialState: {
    ...articleEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticle.fulfilled, (state, action) => {
        state.status = "success",
          articleEntity.setAll(state, action.payload.data)
      })
      .addCase(getArticle.pending, (state) => {
        state.status = "pending"
      })
      .addCase(getArticle.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(setArticle.fulfilled, (state, action) => {
        articleEntity.addOne(state, action.payload)
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        articleEntity.updateOne(state, { id: action.payload.id, updates: action.payload })
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        articleEntity.removeOne(state, action.payload)
      })
  }
})

export const articleSelector = articleEntity.getSelectors(state => state.articleSlice)

export default articleSlice.reducer