"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Users as UsersIcon } from "lucide-react";
import { authStore, rootStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserRoles } from "@/models/enums";
import { resolveRedirectPath } from "@/utils/routerGuard";
import { useRouter } from "next/navigation";

export const LoginView = observer(() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const isReady = rootStore.ready;
    const isAuthenticated = authStore.isAuthenticated;

    useEffect(() => {
        if (isReady && isAuthenticated) {
            const role = authStore.getUserRole();
            router.replace(resolveRedirectPath(role));
        }
    }, [router, isReady, isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!isReady) {
                await rootStore.initialize();
            }

            const success = await authStore.login(email, password);

            if (success) {
                const role = authStore.getUserRole();
                toast({
                    title: "Login successful",
                    description: "Welcome to New Concept!",
                });

                switch (role) {
                    case UserRoles.ADMIN:
                        router.replace(resolveRedirectPath(role));
                        break;
                    case UserRoles.MANAGER:
                        router.replace(resolveRedirectPath(role));
                        break;
                    case UserRoles.STAFF:
                        router.replace(resolveRedirectPath(role));
                        break;
                    case UserRoles.STUDENT:
                        router.replace(resolveRedirectPath(role));
                        break;
                    default:
                        router.replace("/");
                }
            } else {
                toast({
                    title: "Login failed",
                    description: "Invalid email or password",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const demoAccounts = [
        { role: "Admin", email: "admin@newconcept.com", password: "admin123" },
        { role: "Manager Pusat", email: "manager.pusat@newconcept.com", password: "manager123" },
        { role: "Manager Selatan", email: "manager.selatan@newconcept.com", password: "manager123" },
        { role: "Staff Pusat 1", email: "staff1.pusat@newconcept.com", password: "staff123" },
        { role: "Staff Selatan 1", email: "staff1.selatan@newconcept.com", password: "staff123" },
        { role: "Student", email: "ahmad.rizki@student.com", password: "student123" },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#FFF4D4] via-[#FFF9EC] to-[#FFE69A] p-4 lg:p-8">
            <div className="absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-[#FFB300]/40 blur-3xl" />
            <div className="absolute right-[-4rem] bottom-[-6rem] h-80 w-80 rounded-full bg-[#FCCC62]/50 blur-3xl" />
            <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-md lg:flex-row">
                <div className="relative hidden w-full flex-col justify-between bg-gradient-to-br from-[#FFB300] via-[#FFC542] to-[#FFD66B] p-10 text-white lg:flex lg:max-w-[55%]">
                    <div className="absolute inset-0 -z-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-10" />
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                            <span className="inline-block h-2 w-2 rounded-full bg-white" />
                            Welcome Back
                        </div>
                        <h2 className="text-4xl font-bold leading-tight drop-shadow-sm">
                            Empowering English Excellence Across the Nation
                        </h2>
                        <p className="max-w-md text-sm text-white/90">
                            Access the New Concept learning ecosystem, manage branch operations, and
                            stay connected with every student&apos;s journey—securely and confidently.
                        </p>
                    </div>
                    <div className="space-y-4 text-sm text-white/90">
                                <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10">
                                <UsersIcon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-semibold">Multi-role Sign In</p>
                                <p className="text-xs text-white/80">
                                    Admin, Manager, Staff, and Student portals in one unified access
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                                    Need assistance?
                                </p>
                                <p className="text-sm font-semibold text-white">support@newconcept.com</p>
                            </div>
                            <Button variant="secondary" className="bg-white/90 text-[#FFB300] hover:bg-white">
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white/80 px-6 py-10 backdrop-blur lg:max-w-[45%] lg:px-10">
                    <div className="mx-auto w-full max-w-sm space-y-8">
                        <div className="space-y-3 text-center lg:text-left">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB300]/10 shadow-inner lg:mx-0">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1BYJCVCEIv4VSgfxpcPfj_WTtzHv7Da3wvA&s"
                                    alt="New Concept Logo"
                                    className="h-10 w-10 rounded-xl object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold text-foreground">Sign in</h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your credentials to access the New Concept dashboard.
                                </p>
                            </div>
                        </div>

                        <Card className="border-none bg-transparent shadow-none">
                            <CardContent className="p-0">
                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-12 rounded-2xl border border-[#FFB300]/40 bg-white/60 text-sm shadow-sm transition focus:border-[#FFB300] focus:ring-[#FFB300]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-12 rounded-2xl border border-[#FFB300]/40 bg-white/60 text-sm shadow-sm transition focus:border-[#FFB300] focus:ring-[#FFB300]"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-2xl bg-[#FFB300] text-sm font-semibold text-white shadow-lg shadow-[#FFB300]/40 transition hover:bg-[#EAA300]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                                <div className="mt-6">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full rounded-2xl border-[#FFB300]/40 bg-white/70 text-sm font-semibold text-[#9C7611] hover:bg-[#FFF4D4]/70 hover:text-[#3d2a13]"
                                            >
                                                Lihat Akun Demo
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Demo Accounts</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-3">
                                                {demoAccounts.map(({ role, email, password }) => (
                                                    <div
                                                        key={email}
                                                        className="rounded-2xl border border-[#FFB300]/30 bg-[#FFF9EC] px-4 py-3 shadow-sm"
                                                    >
                                                        <p className="text-sm font-semibold text-[#3d2a13]">{role}</p>
                                                        <p className="text-sm text-[#9C7611]">{email}</p>
                                                        <p className="text-xs uppercase tracking-[0.25em] text-[#FFB300]">
                                                            Password: {password}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <p className="mt-6 text-center text-xs text-muted-foreground">
                                    By continuing you agree to our{" "}
                                    <Button variant="link" className="h-auto p-0 text-xs text-[#EAA300]">
                                        Privacy Policy
                                    </Button>
                                    .
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
});
