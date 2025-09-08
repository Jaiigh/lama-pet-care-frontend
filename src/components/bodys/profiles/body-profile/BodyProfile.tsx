import './BodyProfile.css'
import Display from './Display';
import PersonalInfo from './PersonalInfo';
import Animal from './Animal';
import Record from './Record';

function BodyProfile() {
  return (
    <div className="body-profile">
      <div className="left-side">
        <Display />
      </div>
      <div className="right-side">
        <PersonalInfo />
        <Animal />
        <Record />
      </div>
    </div>
  );
}

export default BodyProfile;