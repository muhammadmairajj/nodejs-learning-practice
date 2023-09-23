const fs = require("fs");
const request = require("request");
const axios = require("axios");

// fs.readFile('./data.txt', 'utf-8', (err, data) => {
//     if(err) throw err;
//     fs.writeFile('./output.txt', `Data is Modified: ${data}`, (err2) => {
//         if(err2) throw err2;
//         console.log("data is saved in a new file");
//         request("https://jsonplaceholder.typicode.com/posts", (error, response, body) => {
//             if(error) throw error;
//             const posts = JSON.parse(body);
//             console.log(posts);
//         })
//     })
// })
// console.log("Running...");

// Promises:
// const getSinglePost = (postId) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
//       .then((response) => {
//         const posts = response.data;
//         resolve(posts);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// axios
//   .get("https://jsonplaceholder.typicode.com/posts")
//   .then((response) => {
//     return response.data;
//   })
//   .then((response) => {
//     getSinglePost(response[0].id)
//       .then((post) => {
//         return "Title of this Post is: " + post.title;
//       })
//       .then((response) => {
//         return response;
//       })
//       .then((response) => {
//         console.log(response);
//       })
//       .catch((error) => {
//         console.error(error)
//       })
//   }).catch((error) => {
//     console.error(error);
//   })

// Async Await
// const getSinglePost = async (postId) => {
//   try {
//     const response = await axios.get(
//       `https://jsonplaceholder.typicode.com/posts/${postId}`
//     );
//     // console.log(response.data);
//     return response.data;
//   } catch (err) {
//     console.error(err);
//   }
// };

// (async () => {
//   const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
//   const posts = response.data;
//   const post = await getSinglePost(posts[0].id);
//   console.log(post);
// })();


const getPost = async () => {
    const post1 = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    const post2 = await axios.get("https://jsonplaceholder.typicode.com/posts/2");
    const post3 = await axios.get("https://jsonplaceholder.typicode.com/posts/3");

    [response1, response2, response3] = await Promise.all([post1, post2, post3]);
    
    const data1 = response1.data;
    const data2 = response2.data;
    const data3 = response3.data;

    console.log(data1);
    console.log(data2);
    console.log(data3);
}

getPost();