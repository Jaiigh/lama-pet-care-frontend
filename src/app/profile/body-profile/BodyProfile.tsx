import PersonalInfo from "./PersonalInfo";
import Animal from "./Animal";
import Record from "./Record";
import Display from "./Display";

function BodyProfile() {
  return (
    <div className="flex flex-row w-full h-full gap-[8%]">
      <div className="w-[35%]">
        <Display />
      </div>
      <div className="flex flex-col w-[65%] gap-10">
        <PersonalInfo />
        <Animal />
        <Record />
      </div>
    </div>
  );
}

export default BodyProfile;
