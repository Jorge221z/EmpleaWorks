import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { LogOut, Settings, User } from "lucide-react";

interface UserMenuContentProps {
    user: {
        name: string;
        email: string;
    } | null;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    // Function to handle direct navigation without Inertia
    const navigateToLogin = () => {
        window.location.href = route('login');
    };

    const navigateToRegister = () => {
        window.location.href = route('register');
    };

    if (!user) {
        return (
            <>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={navigateToLogin}>
                        <User className="mr-2 size-4" />
                        <span>Log in</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={navigateToRegister}>
                        <User className="mr-2 size-4" />
                        <span>Register</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </>
        );
    }

    return (
        <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link href={route('profile.edit')}>
                        <User className="mr-2 size-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('password.edit')}>
                        <Settings className="mr-2 size-4" />
                        <span>Password</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('appearance')}>
                        <Settings className="mr-2 size-4" />
                        <span>Appearance</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={route('logout')} method="post" as="button" className="w-full">
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
