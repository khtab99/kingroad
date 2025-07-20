"use client";

import { useEffect, useState } from "react";
import { getToken, deleteToken, deleteUserData } from "@/util/storage";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";
import { User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const AuthButton = ({
  setAuthModalOpen,
}: {
  setAuthModalOpen: (open: boolean) => void;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [tokenState, setTokenState] = useState<string | null>(null);

  const { language } = useStore();
  const t = translations[language];

  useEffect(() => {
    setIsClient(true);
    setTokenState(getToken());
  }, []);

  const handleLogout = () => {
    deleteToken();
    deleteUserData();
    window.location.reload();
  };

  if (!isClient) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <User className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="min-w-[150px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 z-50"
        >
          {tokenState ? (
            <>
              <DropdownMenu.Item
                className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                onClick={handleLogout}
              >
                {t.topNav.logout}
              </DropdownMenu.Item>
              {/* Additional authenticated user options */}
              <DropdownMenu.Item
                className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                onClick={() => alert("Go to profile")}
              >
                {t.topNav.profile || "Profile"}
              </DropdownMenu.Item>
            </>
          ) : (
            <DropdownMenu.Item
              className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setAuthModalOpen(true)}
            >
              {t.topNav.login}
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
