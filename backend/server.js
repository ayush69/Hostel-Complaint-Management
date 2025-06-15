import express from "express"
import connectDb from "./src/configs/connectDb.js";
import dotenv from "dotenv";
import complaintRoutes from './src/routes/complaint.route.js';
import staffRoutes from './src/routes/staff.route.js';

dotenv.config();

const app=express();
app.use(express.json());

app.get("/comp", (req, res) => {
    res.send("Hello World!");
});



connectDb().then(async () => {
    console.log("MongoDb connected");
    app.listen(3000, () => {
        console.log("Server is running on Port no. 3000");
    });
}).catch((err) => {
    console.log(err);
});

app.use("/api/complaints", complaintRoutes);
app.use("/api/staff", staffRoutes); 


