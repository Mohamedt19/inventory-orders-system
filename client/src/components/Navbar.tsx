import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Truck,
  LogOut,
} from "lucide-react";

function LogoMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2CF63] text-[#184B63]">
      <svg
        viewBox="0 0 64 64"
        className="h-6 w-6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="16" width="18" height="32" rx="4" fill="currentColor" />
        <circle cx="39" cy="32" r="13" fill="currentColor" opacity="0.35" />
      </svg>
    </div>
  );
}

type NavItemProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

function NavItem({ to, label, icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition",
          isActive
            ? "bg-[#F2CF63] text-[#184B63] shadow-sm"
            : "text-white/85 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-[#184B63] text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <div className="text-xl font-semibold tracking-tight">
              Operations Control Panel
            </div>
            <div className="mt-1 text-sm text-white/65">
              Inventory & order management
            </div>
          </div>
        </div>
      </div>

      {user ? (
        <>
          <nav className="flex-1 space-y-2 px-4 py-6">
            <NavItem
              to="/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
            />

            <NavItem
              to="/products"
              label="Products"
              icon={<Boxes className="h-5 w-5" />}
            />

            <NavItem
              to="/orders"
              label="Orders"
              icon={<ShoppingCart className="h-5 w-5" />}
            />

            <NavItem
              to="/suppliers"
              label="Suppliers"
              icon={<Truck className="h-5 w-5" />}
            />
          </nav>

          <div className="mt-auto border-t border-white/10 px-4 py-5">
            <div className="mb-3 px-2">
              <div className="text-sm font-medium text-white">{user.name}</div>
              <div className="mt-1 text-xs text-white/60">
                Authenticated user
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </>
      ) : (
        <nav className="space-y-2 px-4 py-6">
          <NavItem
            to="/login"
            label="Login"
            icon={<LogOut className="h-5 w-5" />}
          />
          <NavItem
            to="/register"
            label="Register"
            icon={<LogOut className="h-5 w-5" />}
          />
        </nav>
      )}
    </aside>
  );
}