import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function useAuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [agreedToEligibility, setAgreedToEligibility] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [alert, setAlert] = useState<{ type: "success" | "error" | null, message: string | null }>({ type: null, message: null });
    const router = useRouter();

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const passwordStrength = getPasswordStrength(password);

    const closeAlert = () => setAlert({ type: null, message: null });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: null, message: null });

        if (email === "demo@grantify.co" && password === "demo123") {
            document.cookie = "grantify_demo=true; path=/; max-age=86400";
            router.push("/dashboard");
            setLoading(false);
            return;
        }

        if (isSignUp) {
            if (!agreedToEligibility) {
                setAlert({ type: "error", message: "You must confirm Nigerian eligibility to proceed." });
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setAlert({ type: "error", message: "Password must be at least 6 characters long." });
                setLoading(false);
                return;
            }

            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setAlert({ type: "error", message: error.message });
            } else {
                setAlert({ type: "success", message: "Account created successfully! Check your email for the confirmation link." });
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    setAlert({ type: "error", message: "Please confirm your email address before logging in." });
                } else {
                    setAlert({ type: "error", message: error.message });
                }
            } else {
                router.push("/dashboard");
            }
        }
        setLoading(false);
    };

    const handleOAuth = async (provider: 'google' | 'apple' | 'azure') => {
        setLoading(true);
        setAlert({ type: null, message: null });
        
        // Use an environment variable for redirect URI on Vercel, fallback to origin
        const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
            : `${window.location.origin}/dashboard`;
            
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: redirectUrl
            }
        });
        
        if (error) {
            setAlert({ type: "error", message: error.message });
            setLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        isSignUp, setIsSignUp,
        agreedToEligibility, setAgreedToEligibility,
        loading,
        alert, closeAlert,
        passwordStrength,
        handleSubmit,
        handleOAuth
    };
}
