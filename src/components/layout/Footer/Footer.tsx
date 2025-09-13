export const Footer = () => {
  return (
    <footer className="bg-black text-white py-20">
      <div className="container mx-auto px-5 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold mb-4">About Lama</h3>
            <p className="text-white/60">Your trusted pet care platform</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-white/60">
              <li>Pet Sitting</li>
              <li>Dog Walking</li>
              <li>Pet Grooming</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/60">
              <li>Email: support@lama.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">{/* Social media icons */}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
