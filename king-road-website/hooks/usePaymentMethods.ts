export function usePaymentMethods(): any {
  return [
    {
      id: "cards",
      nameAr: "بطاقات الإمارات",
      nameEn: "UAE Cards",
      icon: "/assets/icons/visa.svg",
    },
    {
      id: "apple-pay",
      nameAr: "آبل باي",
      nameEn: "Apple Pay",
      icon: "/assets/icons/apple.svg",
    },
  ];
}
