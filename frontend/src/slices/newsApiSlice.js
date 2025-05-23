import { NEWS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const newsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNews: builder.query({
      query: () => `${NEWS_URL}/all`,
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    getPublishedNews: builder.query({
      query: () => `${NEWS_URL}`,
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    getNewsById: builder.query({
      query: (id) => ({
        url: `${NEWS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    getLatestNews: builder.query({
      query: () => `${NEWS_URL}/latest`,
      keepUnusedDataFor: 5,
      providesTags: ["News"],
    }),
    createNews: builder.mutation({
      query: (body) => ({
        url: `${NEWS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation({
      query: (data) => ({
        url: `${NEWS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `${NEWS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),
    uploadNewsPDF: builder.mutation({
      query: (data) => ({
        url: `${NEWS_URL}/upload-pdf`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),
    uploadNewsImage: builder.mutation({
      query: (data) => ({
        url: `${NEWS_URL}/upload-image`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetPublishedNewsQuery,
  useGetNewsByIdQuery,
  useGetLatestNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useUploadNewsImageMutation,
  useUploadNewsPDFMutation,
} = newsApiSlice;
