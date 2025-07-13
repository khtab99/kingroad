// components/checkout/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  language: string;
}

export function LoadingSpinner({ language }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {language === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      </div>
    </div>
  );
}
