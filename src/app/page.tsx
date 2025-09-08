import Image from "next/image";
import Header from "@/components/headers/Header";
import Profile from "@/components/bodys/profiles/Profile";

export default function Home() {
  return (
    <div>
      <Header />
      <Profile />
    </div>
  );
}
