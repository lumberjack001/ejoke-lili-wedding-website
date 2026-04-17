"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import supabase from "../config/supabaseClient";
import { useRouter } from "next/navigation";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const toggleVisibility = () => {
    setRevealPassword(!revealPassword);
  };

  const router = useRouter();

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) {
      setToken(JSON.parse(savedToken));
      // router.push("/admin/manage-images");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  }, [token]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const user_id = data.user.id;
      const metadata = data.user.user_metadata || {};
      const role = metadata.role || null; // Fallback in case 'role' is missing

      console.log("User Role: ", role);

      sessionStorage.setItem("user_id", user_id);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem(
        "user_email",
        data?.user?.user_metadata?.full_name,
      );
      setToken(data.session.access_token);

      router.push("/admin/manage-images");
      console.log(data);
    } catch (error: unknown) {
      console.error("sign-in error", (error as Error).message);
      setErrorMessage(
        "Invalid email or password, please check your details and try again",
      );

      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-foreground flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/60 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-slate-950/80">
        <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex items-center bg-gradient-to-br from-background via-background to-secondary/10 px-8 py-12 md:p-16">
            <div className="mx-auto max-w-lg text-center md:text-left">
              <p className="mb-6 text-sm uppercase tracking-[0.35em] text-muted-foreground">
                Admin access
              </p>
              <h1 className="mb-4 text-4xl font-serif text-foreground sm:text-5xl">
                Wedding panel login
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Sign in with your credentials to update the gallery, upload new
                images, and keep the wedding website polished for guests.
              </p>
              <div className="mt-10 rounded-[1.75rem] border border-border/70 bg-background/90 p-6 text-left shadow-sm">
                <p className="text-sm font-medium text-primary">Secure admin</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This panel is for the event organizers only. Keep your login
                  details safe and refresh the gallery whenever new memories
                  arrive.
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 md:p-16 bg-background/95">
            <div className="mx-auto max-w-md">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-muted-foreground">
                Welcome back
              </p>
              <h2 className="mb-8 text-3xl font-semibold text-foreground">
                Login to the dashboard
              </h2>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-[1.5rem] border border-border bg-white/90 px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm font-medium text-muted-foreground">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="text-sm font-medium text-primary hover:text-primary/90"
                    >
                      {revealPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={revealPassword ? "text" : "password"}
                    name="pword"
                    className="w-full rounded-[1.5rem] border border-border bg-white/90 px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full px-6 py-3 text-base font-medium"
                >
                  {isLoading ? "Signing in..." : "Login to Panel"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginForm;
