import MainLayout from "../layouts/MainLayout";

export default function Birds() {
  return (
    <MainLayout>
      <div className="min-h-screen p-10">
        <h1 className="text-4xl font-bold text-green-700 mb-6">
          Birding Around Agro Farms 🐦
        </h1>

        <p className="text-gray-600 mb-8">
          Explore common bird species found around Indian agrotourism farms.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">Indian Peafowl</h3>
            <p>National bird of India, commonly found near rural farms.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">Kingfisher</h3>
            <p>Often seen near water bodies in agricultural areas.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold">Parakeet</h3>
            <p>Green parrots commonly spotted in villages.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
