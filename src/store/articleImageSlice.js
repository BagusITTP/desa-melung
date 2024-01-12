import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const articleImageAPI = `${import.meta.env.VITE_API}/article/image`

export const deleteArticleImage = createAsyncThunk("articleImage/deleteArticleImage", async (id) => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  const response = await fetch(`${articleImageAPI}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  const json = await response.json()

  return json
})

const articleImageEntity = createEntityAdapter({
  selectId: (articleImage) => articleImage.id
})

const articleImageSlice = createSlice({
  name: "articleImage",
  initialState: {
    ...articleImageEntity.getInitialState(),
    status: "idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteArticleImage.fulfilled, (state, action) => {
        articleImageEntity.removeOne(state, action.payload)
      })
  }
})

export const articleImageSelector = articleImageEntity.getSelectors(state => state.articleImageSlice)

export default articleImageSlice.reducer