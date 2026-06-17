import express from "express";

console.log("Savery server starting...");
console.log("Hello from the backend...");

const app = express();
// check if port is in environment variables, if not use 3000
const PORT = process.env.PORT || 3000;

// this function is being called by express to start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

