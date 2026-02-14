import CountUp from "react-countup";

export default function Stats() {
  return (
    <section className="bg-green-50 py-20 text-center">
      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        
        <div>
          <h2 className="text-4xl font-bold text-green-700">
            <CountUp end={50} duration={3} />+
          </h2>
          <p>Agrotourism Destinations</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-green-700">
            <CountUp end={28} duration={3} />+
          </h2>
          <p>Indian States Covered</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-green-700">
            <CountUp end={1000} duration={3} />+
          </h2>
          <p>Happy Visitors</p>
        </div>

      </div>
    </section>
  );
}
