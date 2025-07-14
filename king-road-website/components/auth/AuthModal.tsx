"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Phone, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { login, register } from "@/api/auth";
import { setToken, setUserData } from "@/util/storage";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = "login",
}: AuthModalProps) {
  const { language } = useStore();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    country: "United Arab Emirates",
    phone: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    marketing_opt_in: false,
  });

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegisterInputChange = (
    field: string,
    value: string | boolean
  ) => {
    setRegisterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isLoginFormValid = () => {
    return loginData.email.trim() && loginData.password.trim();
  };

  const isRegisterFormValid = () => {
    return (
      registerData.country.trim() &&
      registerData.phone.trim() &&
      registerData.name.trim() &&
      registerData.email.trim() &&
      registerData.password.trim() &&
      registerData.password_confirmation.trim() &&
      registerData.password === registerData.password_confirmation
    );
  };

  const handleLogin = async () => {
    if (!isLoginFormValid()) {
      toast.error(
        language === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(loginData);

      console.log("Login response:", response?.message);

      if (response?.data?.token) {
        setToken(response?.data?.token);
        setUserData(response?.data?.user);

        toast.success(response?.message);

        onClose();
        onSuccess?.();
      } else {
        toast.error(
          language === "ar"
            ? "البريد الألكتروني او كلمة المرور غير صحيحة"
            : "invalid email or password"
        );
      }

      if (response.guest_cart_transferred) {
        toast.success(
          language === "ar"
            ? "تم نقل عناصر السلة إلى حسابك"
            : "Cart items transferred to your account"
        );
      }
    } catch (error: any) {
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isRegisterFormValid()) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع الحقول بشكل صحيح"
          : "Please fill all fields correctly"
      );
      return;
    }

    if (registerData.password !== registerData.password_confirmation) {
      toast.error(
        language === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(registerData);

      if (response?.data?.token) {
        setToken(response?.data?.token);
        setUserData(response?.data?.user);

        toast.success(
          language === "ar" ? "تم التسجيل بنجاح" : "Registration successful"
        );

        onClose();
        onSuccess?.();
      } else {
        throw new Error(response?.data.message);
      }

      if (response.guest_cart_transferred) {
        toast.success(
          language === "ar"
            ? "تم نقل عناصر السلة إلى حسابك"
            : "Cart items transferred to your account"
        );
      }

      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.log("Registration error:", error.response?.data);

      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {language === "ar"
              ? "تسجيل الدخول أو إنشاء حساب"
              : "Login or Create Account"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </TabsTrigger>
            <TabsTrigger value="register">
              {language === "ar" ? "إنشاء حساب" : "Register"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      handleLoginInputChange("email", e.target.value)
                    }
                    placeholder={
                      language === "ar"
                        ? "أدخل بريدك الإلكتروني"
                        : "Enter Your Email"
                    }
                    className="pl-10 text-left"
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      handleLoginInputChange("password", e.target.value)
                    }
                    placeholder={
                      language === "ar"
                        ? "أدخل كلمة المرور"
                        : "Enter Your Password"
                    }
                    className="pl-10 text-left"
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={!isLoginFormValid() || isLoading}
                className="w-full py-3 text-lg font-medium rounded-md"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {language === "ar"
                      ? "جاري تسجيل الدخول..."
                      : "Logging in..."}
                  </div>
                ) : language === "ar" ? (
                  "تسجيل الدخول"
                ) : (
                  "LOGIN"
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button className="text-gray-600 hover:text-gray-800 text-sm">
                  {language === "ar"
                    ? "نسيت كلمة المرور؟"
                    : "Forgot your password?"}
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              {/* Country Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "البلد" : "Country"}
                </label>
                <div className="relative">
                  <select
                    value={registerData.country}
                    onChange={(e) =>
                      handleRegisterInputChange("country", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white appearance-none pr-10"
                    disabled={isLoading}
                  >
                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Oman">Oman</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Mobile Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "رقم الهاتف" : "Mobile Number"}
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) =>
                      handleRegisterInputChange("phone", e.target.value)
                    }
                    placeholder={
                      language === "ar"
                        ? "أدخل رقم هاتفك"
                        : "Enter Your Mobile Number"
                    }
                    className="pl-16 text-left"
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm border-r border-gray-300 pr-2">
                    +971
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "الاسم" : "Name"}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={registerData.name}
                    onChange={(e) =>
                      handleRegisterInputChange("name", e.target.value)
                    }
                    placeholder={
                      language === "ar" ? "أدخل اسمك" : "Enter Your Name"
                    }
                    className="pl-10 text-left"
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      handleRegisterInputChange("email", e.target.value)
                    }
                    placeholder={
                      language === "ar"
                        ? "أدخل بريدك الإلكتروني"
                        : "Enter Your Email"
                    }
                    className="pl-10 text-left"
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <Input
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    handleRegisterInputChange("password", e.target.value)
                  }
                  placeholder={
                    language === "ar"
                      ? "أدخل كلمة المرور"
                      : "Enter Your Password"
                  }
                  className="text-left"
                  dir="ltr"
                  disabled={isLoading}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                </label>
                <Input
                  type="password"
                  value={registerData.password_confirmation}
                  onChange={(e) =>
                    handleRegisterInputChange(
                      "password_confirmation",
                      e.target.value
                    )
                  }
                  placeholder={
                    language === "ar"
                      ? "أعد إدخال كلمة المرور"
                      : "Confirm Your Password"
                  }
                  className="text-left"
                  dir="ltr"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleRegister}
                disabled={!isRegisterFormValid() || isLoading}
                className="w-full py-3 text-lg font-medium rounded-md"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {language === "ar" ? "جاري الإنشاء..." : "Creating..."}
                  </div>
                ) : language === "ar" ? (
                  "تأكيد"
                ) : (
                  "SUBMIT"
                )}
              </Button>

              {/* Terms & Conditions */}
              <div className="text-center text-sm text-gray-600">
                {language === "ar"
                  ? "بالتسجيل أنت توافق على"
                  : "By registering you agree to our"}
                <br />
                <button className="text-gray-800 hover:text-gray-600 underline">
                  {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
