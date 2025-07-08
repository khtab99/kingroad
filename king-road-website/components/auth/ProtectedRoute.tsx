"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/api/auth";
import { AuthModal } from "./AuthModal";
import { useStore } from "@/store/useStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showModal?: boolean;
  onAuthSuccess?: () => void;
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  showModal = true,
  onAuthSuccess 
}: ProtectedRouteProps) {
  const { language } = useStore();
  const { isAuthenticated, userLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!userLoading && !isAuthenticated && showModal) {
      setShowAuthModal(true);
    }
  }, [userLoading, isAuthenticated, showModal]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onAuthSuccess?.();
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated and modal is disabled, show fallback
  if (!showModal) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "ar" ? "مطلوب تسجيل الدخول" : "Login Required"}
          </h2>
          <p className="text-gray-600">
            {language === "ar" 
              ? "يجب تسجيل الدخول للوصول إلى هذه الصفحة"
              : "You need to login to access this page"}
          </p>
        </div>
      </div>
    );
  }

  // Show auth modal
  return (
    <>
      {fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "ar" ? "مطلوب تسجيل الدخول" : "Login Required"}
            </h2>
            <p className="text-gray-600">
              {language === "ar" 
                ? "يجب تسجيل الدخول للمتابعة"
                : "Please login to continue"}
            </p>
          </div>
        </div>
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleModalClose}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}