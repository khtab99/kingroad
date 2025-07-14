"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { useVendorAuth } from "@/contexts/vendor-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Store,
  Globe,
  MessageSquare,
  HelpCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { deleteAdminData, deleteToken, getAdminData } from "@/util/storage";
import { useRouter } from "next/navigation";

export function VendorHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useVendorAuth();

  const router = useRouter();

  const handleLogout = () => {
    deleteToken();
    deleteAdminData();
    window.location.reload();
  };
  const adminData = localStorage.getItem("admin_data");
  const admin = JSON.parse(adminData || "{}");

  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products, orders..."
              className="pl-10 bg-background/60 border-border/60"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {t("nav.language")}
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" asChild>
            {theme === "dark" ? (
              <button onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4" />
              </button>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-sm bg-muted">
                    {admin?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <div className="flex items-center flex-col gap-2 border-b border-border">
                  <p className="text-sm font-medium leading-none">
                    {admin?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {admin?.email}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Store className="h-4 w-4" />
                  View Storefront
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
