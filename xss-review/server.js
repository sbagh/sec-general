// chatgpt app to review XSS vulnerabilities
// app allows users to leave comments and search for content
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3200;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

const comments = [];

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/search", (req, res) => {
   const query = req.query.q || "";
   const htmlContent = `
    <html>
      <head><title>Search</title></head>
      <body>
        <h2>Search Results</h2>
        <p>You searched for: ${query}</p>
        <p><a href="/">Back to Home</a></p>
      </body>
    </html>
  `;
   res.send(htmlContent);
});

app.get("/comments", (req, res) => {
   // Build an HTML list of comments
   const commentsList = comments.map((c) => `<li>${c}</li>`).join("");

   const htmlContent = `
    <html>
      <head><title>Comments</title></head>
      <body>
        <h2>Leave a Comment</h2>
        <form action="/comments" method="POST">
          <input type="text" name="comment" placeholder="Type your comment" />
          <button type="submit">Submit</button>
        </form>
        <h3>All Comments</h3>
        <ul>
          ${commentsList}
        </ul>
        <p><a href="/">Back to Home</a></p>
      </body>
    </html>
  `;
   res.send(htmlContent);
});

app.post("/comments", (req, res) => {
   const userComment = req.body.comment || "";
   comments.push(userComment);
   res.redirect("/comments");
});

// the HTML is served statically from profile.html, which can contain DOM-based issues
app.get("/profile", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "profile.html"));
});

app.listen(PORT, () => {
   console.log(`Server running on port', ${PORT}`);
});
