"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ProductsPage() {
  useEffect(() => {
    redirect("/products/others");
  }, []);

  return null;
}
