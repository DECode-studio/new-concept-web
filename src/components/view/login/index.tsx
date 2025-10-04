import { useState } from "react";
import { observer } from "mobx-react-lite";
import { authStore } from "@/stores/AuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserRoles } from "@/models/enums";
import { useRouter } from "next/navigation";

export const LoginView = observer(() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = authStore.login(email, password);

            if (success) {
                const role = authStore.getUserRole();
                toast({
                    title: "Login successful",
                    description: "Welcome to New Concept!",
                });

                // Redirect based on role
                switch (role) {
                    case UserRoles.ADMIN:
                        router.replace("/admin/dashboard");
                        break;
                    case UserRoles.MANAGER:
                        router.replace("/manager/dashboard");
                        break;
                    case UserRoles.STAFF:
                        router.replace("/staff/dashboard");
                        break;
                    case UserRoles.STUDENT:
                        router.replace("/student/dashboard");
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

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1BYJCVCEIv4VSgfxpcPfj_WTtzHv7Da3wvA&s"
                            alt="New Concept Logo"
                            className="h-16 w-16 rounded-xl"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold">New Concept</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Demo Accounts:</p>
                        <div className="space-y-1 text-xs">
                            <p><strong>Admin:</strong> admin@newconcept.com / admin123</p>
                            <p><strong>Manager:</strong> manager.pusat@newconcept.com / manager123</p>
                            <p><strong>Staff:</strong> staff1.pusat@newconcept.com / staff123</p>
                            <p><strong>Student:</strong> ahmad@student.com / student123</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});
