"use client";

import "./PersonalInfo.css";

import { use, useEffect, useState } from 'react';
import { Profile } from '@/interfaces/profileInterface';
import { getProfile } from '@/services/profileService';

function PersonalInfo() {
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

    const info_items = [
        {id:1, label:"ชื่อนามสกุล", value: profile?.name || "loading..."}, 
        {id:2, label:"เลขประจำตัวผู้ใช้", value: profile?.id || "loading..."},
        {id:3, label:"หมายเลขโทรศัพท์", value: profile?.tel || "loading..."}, 
        {id:4, label:"อีเมล", value: profile?.email || "loading..."},
        {id:5, label:"วันที่สมัครสมาชิก", value: profile?.createdAt || "loading..."}, 
        {id:6, label:"วันเกิด", value: profile?.birthDate || "loading..."},
        {id:7, label:"ที่อยู่", value: profile?.address || "loading..."},
    ];

    return (
        <div className="personal-info">
            <div className="header">* ข้อมูลส่วนตัว</div>
            <div className="info-container">
                {info_items.map((item) => (
                    <div key={item.id} className="info-display">
                        <div className="info-label">{item.label}</div>
                        <div className="info-value">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PersonalInfo;