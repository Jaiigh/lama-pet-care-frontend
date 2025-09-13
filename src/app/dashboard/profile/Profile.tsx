import TopProfile from './top-profile/TopProfile';
import BodyProfile from './body-profile/BodyProfile';

function Profile() {
  return (
    <div className="flex flex-col items-center w-full h-auto p-5 md:px-20 bg-[#F0FDFA]">
      <TopProfile />
      <BodyProfile />
    </div>
  );
}

export default Profile;