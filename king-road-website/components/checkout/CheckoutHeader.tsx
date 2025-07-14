import { ChevronRight, ChevronLeft } from "lucide-react";

interface CheckoutHeaderProps {
  language: string;
  onBack: () => void;
  title: string;
}

export default function CheckoutHeader({
  language,
  onBack,
  title,
}: CheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        {language === "ar" ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      <h1 className="text-lg font-medium text-gray-800">{title}</h1>

      <div></div>
    </div>
  );
}
