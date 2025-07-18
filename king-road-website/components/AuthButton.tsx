"use client";
import { deleteToken, deleteUserData, getToken } from "@/util/storage";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import translations from "@/data/translations.json";

// If using App Router in Next.js

export const AuthButton = ({ setAuthModalOpen }: any) => {
  const [isClient, setIsClient] = useState(false);

  const { language } = useStore();
  const t = translations[language];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const token = getToken();

  if (!isClient) return null;

  return (
    <span
      onClick={() => {
        if (token) {
          deleteToken();
          deleteUserData();
          window.location.reload();
        } else {
          setAuthModalOpen(true);
        }
      }}
      className="cursor-pointer hover:text-gray-900 font-medium"
    >
      {token ? t.topNav.logout : t.topNav.login}
    </span>
  );
};
