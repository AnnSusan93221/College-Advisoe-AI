const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const twilio = require("twilio");
const bcrypt = require("bcrypt");

dotenv.config();
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
const app = express();
app.use(express.json());
app.use(cors());

// Twilio Setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// OTP Schema
const OtpSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});
const Otp = mongoose.model("Otp", OtpSchema);

// 📌 Send OTP API
app.post("/send-otp", async (req, res) => {
    let { phone } = req.body;
    if (!phone) return res.json({ success: false, message: "Phone number is required" });

    // Ensure correct phone format (add +91 if missing)
    if (!phone.startsWith("+")) phone = "+91" + phone;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await Otp.findOneAndUpdate({ phone }, { otpHash, expiresAt }, { upsert: true });

    try {
        await client.messages.create({
            body: `🔐 Your OTP is: ${otp}. It expires in 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("❌ Twilio Error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
});

// 📌 Verify OTP API
app.post("/verify-otp", async (req, res) => {
    let { phone, otp } = req.body;
    if (!phone || !otp) return res.json({ success: false, message: "Phone and OTP required" });

    if (!phone.startsWith("+")) phone = "+91" + phone;

    const storedOtp = await Otp.findOne({ phone });
    if (!storedOtp) return res.json({ success: false, message: "OTP expired or invalid." });

    // Expiry Check
    if (new Date() > storedOtp.expiresAt) {
        await Otp.deleteOne({ phone });
        return res.json({ success: false, message: "OTP expired. Request a new one." });
    }

    // Compare OTPs securely
    const isMatch = await bcrypt.compare(otp, storedOtp.otpHash);
    if (!isMatch) return res.json({ success: false, message: "Invalid OTP. Try again." });

    await Otp.deleteOne({ phone }); // Delete OTP after verification
    res.json({ success: true, message: "✅ OTP Verified!" });
});

// 📌 Predict Career Path API (Dummy Response)
app.post("/predict-career", async (req, res) => {
    const { answers } = req.body;
    if (!answers || answers.length === 0) return res.json({ success: false, message: "No answers provided." });

    const recommendations = ["Engineering", "Medical", "Law", "Arts", "Aviation"];
    const recommendedCareer = recommendations[Math.floor(Math.random() * recommendations.length)];

    res.json({ success: true, recommendation: recommendedCareer });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));