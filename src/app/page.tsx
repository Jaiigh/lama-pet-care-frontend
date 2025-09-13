import Image from "next/image";
import Header from "@/components/headers/Header";
import Profile from "@/app/dashboard/profile/Profile";

export default function Home() {
  return (
    <div>
      <Header />
      <Profile />
    </div>
  );
}
