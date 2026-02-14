import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
        What Our Visitors Say 🌿
      </h2>

      <div className="max-w-4xl mx-auto">
        <Swiper spaceBetween={30} slidesPerView={1} autoplay={{ delay: 3000 }}>
          <SwiperSlide>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center">
              <p className="text-gray-600 dark:text-gray-300">
                "Amazing rural experience! Loved the farm stay in Maharashtra."
              </p>
              <h4 className="mt-4 font-semibold text-green-700">
                - Priya Sharma
              </h4>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-center">
              <p className="text-gray-600 dark:text-gray-300">
                "AgroVista made discovering cultural festivals so easy!"
              </p>
              <h4 className="mt-4 font-semibold text-green-700">
                - Krish Verma
              </h4>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
