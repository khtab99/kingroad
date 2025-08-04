import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SuccessPageContent from "@/components/checkout/success/SuccessPageContent";

export default function SuccessPage() {
  return (
    <>
      {/* <Header /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessPageContent />
      </Suspense>
      {/* <Footer /> */}
    </>
  );
}
