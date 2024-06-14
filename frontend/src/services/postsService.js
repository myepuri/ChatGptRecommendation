import axios from "axios";
import postsData from "../data/posts.json";

export async function initializePosts() {
  await axios.post("http://localhost:3000/posts/multiple", postsData);
}

export async function getAllPosts() {
  const res = await axios.get("http://localhost:3000/posts/");
  return res.data.posts;
}

export async function getPost(id) {
  const res = await axios.get(`http://localhost:3000/post/${id}`);
  return res.data.post;
}

export async function addPost(newPost) {
  const res = await axios.post(`http://localhost:3000/posts`, newPost);
  console.log(res);
  return res.data.post;
}

export async function updatePost(updatedPost) {
  const res = await axios.put(
    `http://localhost:3000/post/${updatedPost.id}`,
    updatedPost
  );
  console.log(res);
  return res.data.updatedPost;
}

export async function deletePost(id) {
  await axios.delete(`http://localhost:3000/post/${id}`);
}

export async function generateComment(id) {
  const res = await axios.get(
    `http://localhost:3000/post/${id}/generateComment`
  );
  return res.data.comment.content;
}

export async function getRecommendations(ipAddress, activity, ipData) {
  const res = await axios.post(`http://localhost:3000/search-activities`, {
    ipAddress,
    activity,
    ipData,
  });
  return res.data.activities;
}

export async function getRealTimeRecommendations() {
  const restaurants = JSON.parse(localStorage.getItem("Restaurants"));
  const musics = JSON.parse(localStorage.getItem("Music"));
  const sports = JSON.parse(localStorage.getItem("Sports"));
  const res = await axios.post(`http://localhost:3000/recommended-for-you`, {
    restaurants,
    musics,
    sports,
  });
  return res?.data?.results;
}
