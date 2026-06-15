const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (/\s/.test(username)) {
      return res.status(400).json({ message: "Username cannot contain spaces." });
    }

    // 1. Check if Username is already taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "Username is already taken. Please choose another." });
    }

    // 2. Check if Email is already registered
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Email is already registered. Please login." });
    }

    const user = await User.create({ username, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Signup success",
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const normalizeGoogleProfile = (payload) => {
  const email = payload.email;
  const baseUsername =
    (payload.name || email || "googleuser")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 18) || "googleuser";

  return {
    googleId: payload.sub,
    email,
    username: baseUsername,
    name: payload.name || payload.given_name || baseUsername,
    profileImage: payload.picture,
  };
};

const ensureUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let suffix = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return username;
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res
        .status(400)
        .json({ message: "Google account email not available" });
    }

    const googleUser = normalizeGoogleProfile(payload);
    let user = await User.findOne({
      $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
    });

    if (!user) {
      const uniqueUsername = await ensureUniqueUsername(googleUser.username);
      user = await User.create({
        username: uniqueUsername,
        email: googleUser.email,
        googleId: googleUser.googleId,
        authProvider: "google",
        name: googleUser.name,
        profileImage: googleUser.profileImage,
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
      }

      user.authProvider = "google";

      if (!user.profileImage && googleUser.profileImage) {
        user.profileImage = googleUser.profileImage;
      }

      if (!user.name && googleUser.name) {
        user.name = googleUser.name;
      }

      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: "Google login success",
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.log("GOOGLE AUTH ERROR:", err);
    res
      .status(500)
      .json({ message: "Google authentication failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by Email OR Username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    // 2. Check Password using the method in User.js
    const correct = await user.matchPassword(password);
    if (!correct) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = generateToken(user._id);

    res.json({
      message: "Login success",
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
