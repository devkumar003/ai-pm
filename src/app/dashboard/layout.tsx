"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Map,
  GitBranch,
  Swords,
  ListChecks,
  BarChart3,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/prd", icon: FileText, label: "PRD Generator" },
  { href: "/dashboard/roadmap", icon: Map, label: "Roadmap" },
  { href: "/dashboard/diagrams", icon: GitBranch, label: "AI Diagrams" },
  { href: "/dashboard/competitors", icon: Swords, label: "Competitors" },
  { href: "/dashboard/tasks", icon: ListChecks, label: "Task Board" },
  { href: "/dashboard/priorities", icon: BarChart3, label: "Priority Matrix" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();
  const { user } = useUser();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "light" : "dark"
    );
  };

  const currentPage = navItems.find((item) => item.href === pathname);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "260px" : "72px",
          minHeight: "100vh",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-default)",
          display: "flex",
          flexDirection: "column",
          transition: "width var(--transition-normal)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {/* Logo - click to toggle sidebar */}
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid var(--border-default)",
            cursor: "pointer",
            userSelect: "none",
          }}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <img
            src="/orbit-logo.png"
            alt="Orbit AI"
            style={{
              width: "32px",
              height: "32px",
              minWidth: "32px",
              objectFit: "contain",
              transition: "transform var(--transition-fast)",
            }}
          />
          {sidebarOpen && (
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              Orbit AI
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  marginBottom: "4px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  background: isActive
                    ? "rgba(250, 204, 21, 0.1)"
                    : "transparent",
                  borderLeft: isActive
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                  transition: "all var(--transition-fast)",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <item.icon
                  size={20}
                  color={isActive ? "#facc15" : "var(--text-muted)"}
                  style={{ minWidth: "20px" }}
                />
                {sidebarOpen && (
                  <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border-default)",
          }}
        >
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{
              width: "100%",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              marginBottom: "8px",
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && (
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          {/* User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
            }}
          >
            <UserButton />
            {sidebarOpen && (
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {user?.fullName || user?.username || "User"}
                </div>
                <div
                  style={{ fontSize: "11px", color: "var(--text-muted)" }}
                >
                  Product Manager
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "260px" : "72px",
          transition: "margin-left var(--transition-normal)",
        }}
      >
        {/* Top Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            padding: "20px 32px",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Dashboard
              </Link>
              {currentPage && currentPage.href !== "/dashboard" && (
                <>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>›</span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {currentPage.label}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: "32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
