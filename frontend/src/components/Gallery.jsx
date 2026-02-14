import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Gallery() {
  return (
    <div className="py-20 px-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        Explore Gallery
      </h2>

      <Swiper spaceBetween={20} slidesPerView={3}>
        <SwiperSlide>
          <img
            src="https://tractorkarvan.com/storage/images/Blogs/agritourism-in-india/Agritourism-Blog-New.jpg"
            className="rounded-xl"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1yPKqw_E1zRcCwyV_QOOsM30Q61TUM3ZV4A&s"
            className="rounded-xl"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://im.whatshot.in/img/2020/Oct/1493974114-anjanvelagrotourismstory-1600179150-1603678336.jpg"
            className="rounded-xl"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKkx3vJog9f7vUVkbbYwvX2zOt8xgahkSNSg&s"
            className="rounded-xl"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://bhavnagar.city/wp-content/uploads/2025/11/wood-packer-agro-tourism.jpg"
            className="rounded-xl"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUMnxciRT5JMWhVCEzaUoFFdkBrFDXOEqAVA&s"
            className="rounded-xl"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
