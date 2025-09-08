import './Profile.css'
import TopProfile from './top-profile/TopProfile';
import BodyProfile from './body-profile/BodyProfile';

function Profile() {
  return (
    <div className="profile-container">
      <TopProfile />
      <BodyProfile />
    </div>
  );
}

export default Profile;