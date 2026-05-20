import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { googleAuth, login } from "../../api/api";
import { ensureGoogleIdentityLoaded } from "../../utils/googleIdentity";
import "../../App.css";
import "./LoginPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Dashboard/Footer/Footer";

const GOOGLE_LOGIN_BUTTON_ID = "google-login-signin-button";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      setError("Google sign-in is not configured");
      return undefined;
    }

    let active = true;

    const initGoogleButton = async () => {
      try {
        await ensureGoogleIdentityLoaded();

        if (!active) {
          return;
        }

        const buttonContainer = document.getElementById(GOOGLE_LOGIN_BUTTON_ID);
        if (!buttonContainer) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setGoogleLoading(true);
            setError("");
            try {
              const { data } = await googleAuth(response.credential);
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
              if (window.chrome?.storage) {
                chrome.storage.local.set({ codekeeper_token: data.token });
              }
              navigate("/dashboard");
              toast.success("Logged in with Google!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            } catch (err) {
              setError(err.response?.data?.message || "Google sign-in failed");
            } finally {
              setGoogleLoading(false);
            }
          },
        });

        buttonContainer.innerHTML = "";
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "signin_with",
          shape: "rectangular",
        });
      } catch {
        if (!active) {
          return;
        }

        setError("Google sign-in is temporarily unavailable");
      }
    };

    initGoogleButton();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      // Save token (adjust based on your actual response structure)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (window.chrome?.storage) {
        chrome.storage.local.set({
          codekeeper_token: data.token,
        });
      }

      navigate("/dashboard"); // Redirect to Home or Dashboard
      toast.success("Logged In successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-wrapper">
        <div className="glass-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Continue your revision streak</p>

          {error && (
            <p
              style={{
                color: "#ef4444",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group password-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : "Log In"}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="google-signin-shell">
            {googleLoading ? (
              <button type="button" className="google-auth-button" disabled>
                Connecting...
              </button>
            ) : (
              <div
                id={GOOGLE_LOGIN_BUTTON_ID}
                className="google-signin-button"
              ></div>
            )}
          </div>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
