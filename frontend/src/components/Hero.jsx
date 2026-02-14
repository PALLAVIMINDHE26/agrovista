export default function Hero() {
  return (
    <div
      className="h-[80vh] flex items-center justify-center text-white text-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-6 backdrop-blur-md bg-white/10 p-10 rounded-2xl border border-white/20 shadow-2xl">
        <h1 className="text-5xl font-bold mb-6">
          Experience Rural India 🌾
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Explore authentic agrotourism destinations, discover Indian culture,
          and connect with nature.
        </p>
      </div>
    </div>
  );
}
