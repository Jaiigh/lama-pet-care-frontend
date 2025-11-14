import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  return (
    <Suspense fallback="Loading...">
      <SuccessClient />
    </Suspense>
  );
}
