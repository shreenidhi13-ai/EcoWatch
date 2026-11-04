import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Leaf,
    UserRound,
    ShieldCheck,
    Mail,
    LockKeyhole,
    ArrowRight,
    Eye,
    EyeOff
} from "lucide-react";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

                const response = await fetch(
    "http://127.0.0.1:5000/api/v1/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        role
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            if (!data.token) {
                throw new Error("Authentication token was not received.");
            }

            localStorage.setItem("ecowatch_token", data.token);
            localStorage.setItem("ecowatch_user", JSON.stringify(data.user));

           navigate(data.user.role === "admin" ? "/admin-dashboard" : "/dashboard");
        } catch (err) {
            setError(
                err.message === "Failed to fetch"
                    ? "Cannot connect to EcoWatch server. Please start the backend."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ew-login-page">
            <div className="ew-login-left">
                <Link to="/login" className="ew-login-brand">
                    <span className="ew-brand-icon">
                        <Leaf size={24} />
                    </span>
                    <span>EcoWatch</span>
                </Link>

                <div className="ew-login-message">
                    <span className="ew-small-label">
                        ENVIRONMENTAL INTELLIGENCE
                    </span>

                    <h1>
                        Together, let's build a
                        <span> greener tomorrow.</span>
                    </h1>

                    <p>
                        A platform where citizens can report environmental
                        problems, monitor authority action and create
                        meaningful change in their communities.
                    </p>
                </div>

                <div className="ew-login-bottom">
                    <span>Coimbatore · Tamil Nadu</span>
                    <span>© 2026 EcoWatch</span>
                </div>
            </div>

            <div className="ew-login-right">
                <div className="ew-login-card">
                    <div className="ew-login-heading">
                        <span className="ew-small-label">
                            WELCOME TO ECOWATCH
                        </span>

                        <h2>Sign in to continue</h2>

                        <p>
                            Select your account type to access your portal.
                        </p>
                    </div>

                    <div className="ew-role-selector">
                        <button
                            type="button"
                            className={role === "user" ? "active" : ""}
                            onClick={() => setRole("user")}
                        >
                            <UserRound size={19} />
                            Citizen
                        </button>

                        <button
                            type="button"
                            className={role === "admin" ? "active" : ""}
                            onClick={() => setRole("admin")}
                        >
                            <ShieldCheck size={19} />
                            Administrator
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="ew-login-form">
                        <label>Email Address</label>

                        <div className="ew-input-wrapper">
                            <Mail size={18} />

                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <label>Password</label>

                        <div className="ew-input-wrapper">
                            <LockKeyhole size={18} />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="ew-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {error && (
                            <p className="ew-login-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="ew-login-submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : `Sign in as ${role === "user" ? "Citizen" : "Admin"}`}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {role === "user" && (
                        <p className="ew-register-text">
                            New to EcoWatch?
                            <Link to="/register"> Create an account</Link>
                        </p>
                    )}

                    {role === "admin" && (
                        <p className="ew-admin-note">
                            <ShieldCheck size={16} />
                            Restricted access for authorised administrators.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;