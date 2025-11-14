import { Suspense } from "react";
import SelectStaffClient from "./SelectStaffClient";

export const dynamic = "force-dynamic";

export default function SelectStaffPage() {
  return (
    <Suspense fallback="Loading...">
      <SelectStaffClient />
    </Suspense>
  );
}
