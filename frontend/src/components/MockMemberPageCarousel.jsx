import React from "react";
import { Carousel } from "react-bootstrap";

// Mock carousel images
const mockCarouselImages = [
  {
    _id: "1",
    title: "Ski Resort Panorama",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2000",
  },
  {
    _id: "2",
    title: "Mountain Lodge",
    image:
      "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?q=80&w=2000",
  },
  {
    _id: "3",
    title: "Winter Landscape",
    image:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=2000",
  },
];

const MockMemberPageCarousel = () => {
  return (
    <Carousel fade touch className="shadow">
      {mockCarouselImages.map((img) => (
        <Carousel.Item key={img._id} interval={7000}>
          <img
            className="d-block w-100"
            src={img.image}
            style={{ height: "65vh" }}
            alt={img.title}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MockMemberPageCarousel;
