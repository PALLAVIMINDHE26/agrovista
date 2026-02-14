export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-400">
            AgroVista 🌿
          </h2>
          <p className="text-gray-400">
            India’s unified agrotourism platform integrating culture & AI.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Destinations</li>
            <li>Culture</li>
            <li>AI Services</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">Email: support@agrovista.com</p>
          <p className="text-gray-400">Phone: +91 98765 43210</p>
          <p className="text-gray-400">Location: Rural India</p>
        </div>

      </div>

      <div className="text-center mt-10 text-gray-500">
        © 2026 AgroVista. All rights reserved.
        
      </div> 
    </footer>
  );
}
