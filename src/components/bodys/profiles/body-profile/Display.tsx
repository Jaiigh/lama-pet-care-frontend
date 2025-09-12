"use client";

import './Display.css';
import Image from 'next/image';
import Logo from "@/assets/empty-avatar.png";

import { use, useEffect, useState } from 'react';
import { Profile } from '@/interfaces/profileInterface';
import { getProfile } from '@/services/profileService';

function Display() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = '0917f704-f9e1-4d21-a940-8eb609242313'; // test user_id -> fix when auth is ready
        const data = await getProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="display-profile">
        <div className="avatar-section">
            <Image src={Logo} alt="avatar" width={120}height={120}/>
            <div className="name">{profile?.name || "loading..."}</div>
        </div>
        <div className="info-section">
            <div className='user-role'>* Pet Owner</div>
            <div className='user-stats'>
                <div className='stats-item'>
                  <div>X</div>
                  <div>สัตว์เลี้ยง</div>
                </div>
                <div className='stats-item'>
                  <div>X</div>
                  <div>บริการที่ใช้</div>
                </div>
                <div className='stats-item'>
                  <div>X</div>
                  <div>ปีที่เป็นสมาชิก</div>
                </div>
            </div>
        </div>
        <button className="edit-section">* แก้ไขโปรไฟล์</button>
    </div>
  );
}

export default Display;