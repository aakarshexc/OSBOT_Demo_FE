import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { fetchMe } from "@/features/auth/services/userProfileService";
import type { MeUser } from "@/features/auth/auth.service";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useHasPermission } from "@/hooks/use-permissions";
import { useHasRole } from "@/hooks/use-roles";
import { APP_NAME } from "@/lib/app-config";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token, user, signOut } = useAuthStore();

  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [meUser, setMeUser] = useState<MeUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const prevAuthenticatedRef = useRef(isAuthenticated);

  // Permission checks
  const hasClientCreate = useHasPermission("client:create");
  const hasClientView = useHasPermission("client:view");
  const hasUserCreate = useHasPermission("user:create");
  const hasUserView = useHasPermission("user:view");
  const hasRoleCreate = useHasPermission("role:create");

  // Role checks
  const isSuperAdmin = useHasRole("SUPER_ADMIN");
  const isClientAdmin = useHasRole("CLIENT_ADMIN");

  const handleLogout = () => {
    signOut();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    navigate({ to: "/sign-in" });
  };

  const handleLogin = () => navigate({ to: "/sign-in" });

  const isActive = (path: string): boolean =>
    location.pathname === path || location.pathname.startsWith(path);

  const navLinkClass = (path: string): string =>
    `text-sm font-medium ${isActive(path)
      ? "text-primary"
      : "text-muted-foreground hover:text-foreground"
    }`;

  useEffect(() => {
    // Only clear user when authentication changes from true to false
    // Use setTimeout to avoid synchronous setState in effect
    if (!isAuthenticated && prevAuthenticatedRef.current) {
      setTimeout(() => {
        setMeUser(null);
      }, 0);
    }
    prevAuthenticatedRef.current = isAuthenticated;

    if (!isAuthenticated || !token) return;

    let cancelled = false;

    const loadMe = async () => {
      try {
        const data = await fetchMe(token);
        if (!cancelled) setMeUser(data.user);
      } catch {
        if (!cancelled) setMeUser(null);
      }
    };

    loadMe();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  const effectiveUser = meUser || user;

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-xl"
        >
          ☰
        </button>

        <span className="hidden md:block text-lg font-semibold tracking-tight">
          {APP_NAME}
        </span>

        <nav className="hidden md:flex gap-6">

          {/* Users */}
          {hasUserView && (
            <Link to="/users" className={navLinkClass("/users")}>
              Users
            </Link>
          )}

          {/* Clients */}
          {hasClientView && (
            <Link to="/clients" className={navLinkClass("/clients")}>
              Clients
            </Link>
          )}

          {/* Create client */}
          {hasClientCreate && (
            <Link
              to="/create-client"
              className={navLinkClass("/create-client")}
            >
              Create client
            </Link>
          )}

          {/* Create Role */}
          {(isSuperAdmin || isClientAdmin || hasRoleCreate) && (
            <Link
              to="/create-role"
              className={navLinkClass("/create-role")}
            >
              Create Role
            </Link>
          )}

          {/* User create */}
          {hasUserCreate && (
            <Link
              to="/client/create-user"
              className={navLinkClass("/client/create-user")}
            >
              Create user
            </Link>
          )}

        </nav>

        <span className="md:hidden text-lg font-semibold tracking-tight">
          {APP_NAME}
        </span>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-sky-400 bg-sky-50 text-sky-700"
              >
                <User className="h-4 w-4" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-64 rounded-md border bg-white shadow-lg p-3 text-sm z-50">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="break-all mb-3">
                    {effectiveUser?.email ?? "—"}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => {
                      setChangePwdOpen(true);
                      setProfileOpen(false);
                    }}
                  >
                    Change Password
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Button size="sm" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 pb-3 border-t bg-background">

          {hasUserView && (
            <Link
              to="/users"
              className="block py-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Users
            </Link>
          )}

          {hasClientView && (
            <Link
              to="/clients"
              className="block py-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Clients
            </Link>
          )}

          {hasClientCreate && (
            <Link
              to="/create-client"
              className="block py-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create client
            </Link>
          )}

          {(isSuperAdmin || isClientAdmin || hasRoleCreate) && (
            <Link
              to="/create-role"
              className="block py-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Role
            </Link>
          )}

          {hasUserCreate && (
            <Link
              to="/client/create-user"
              className="block py-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create user
            </Link>
          )}

        </nav>
      )}
      <ChangePasswordModal
        open={changePwdOpen}
        onClose={() => setChangePwdOpen(false)}
      />

    </header>
  );
}
