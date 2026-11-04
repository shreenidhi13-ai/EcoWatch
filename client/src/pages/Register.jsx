import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, UserRound, Mail, LockKeyhole, ArrowRight } from "lucide-react";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/auth/register",
                
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            navigate("/login", {
                state: {
                    registered: true,
                    email
                }
            });

        } catch (err) {
            setError(
                err.message === "Failed to fetch"
                    ? "Cannot connect to EcoWatch server."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ew-register-page">
            <div className="ew-register-left">
                <Link to="/login" className="ew-register-brand">
                    <span className="ew-register-icon">
                        <Leaf size={24} />
                    </span>
                    EcoWatch
                </Link>

                <div className="ew-register-message">
                    <span>JOIN THE MOVEMENT</span>
                    <h1>
                        Your voice can
                        <span> protect nature.</span>
                    </h1>
                    <p>
                        Join a community working towards cleaner,
                        safer and greener neighbourhoods.
                    </p>
                </div>

                <div className="ew-register-bottom">
                    Coimbatore · Tamil Nadu
                </div>
            </div>

            <div className="ew-register-right">
                <div className="ew-register-card">
                    <span className="ew-register-label">
                        GET STARTED
                    </span>

                    <h2>Create your account</h2>

                    <p>Register as an EcoWatch citizen.</p>

                    <form onSubmit={handleSubmit}>
                        <label>Full Name</label>
                        <div className="ew-register-input">
                            <UserRound size={18} />
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <label>Email Address</label>
                        <div className="ew-register-input">
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
                        <div className="ew-register-input">
                            <LockKeyhole size={18} />
                            <input
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <label>Confirm Password</label>
                        <div className="ew-register-input">
                            <LockKeyhole size={18} />
                            <input
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="ew-register-error" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="ew-register-submit"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="ew-register-footer">
                        Already have an account?
                        <Link to="/login"> Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;