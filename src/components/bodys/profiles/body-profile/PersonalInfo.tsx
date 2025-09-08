import "./PersonalInfo.css";

const info_items = [
    {id:1, label:"ชื่อนามสกุล", value:"คุณมังกี้ ดี ลูฟฟี้"}, 
    {id:2, label:"เลขประจำตัวผู้ใช้", value:"LAMA001234"},
    {id:3, label:"หมายเลขโทรศัพท์", value:"089-123-4567"}, 
    {id:4, label:"อีเมล", value:"somchai@email.com"},
    {id:5, label:"วันที่สมัครสมาชิก", value:"15 มกราคม 2023"}, 
    {id:6, label:"วันเกิด", value:"15 มกราคม 2000"},
    {id:7, label:"ที่อยู่", value:"123/45 ซอยกะหล่ำ 21 แขวงโอยิงาชิมะ เขตเอลบัฟ กรุงเทพฯ 10880"},
];

function PersonalInfo() {
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