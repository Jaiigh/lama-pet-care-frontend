import PersonalInfo from "./PersonalInfo";
import Animal from "./Animal";
import Display from "./Display";
import PaymentHistory from "@/components/profile/PaymentHistory";

function BodyProfile() {
  return (
    <div className="flex flex-row w-full h-full gap-[8%]">
      <div className="w-[35%]">
        <Display />
      </div>
      <div className="flex flex-col w-[65%] gap-10">
        <PersonalInfo />
        <Animal />
        <PaymentHistory />
      </div>
    </div>
  );
}

export default BodyProfile;
