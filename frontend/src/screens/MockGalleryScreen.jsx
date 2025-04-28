import { useMemo } from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ErrorBoundary from "../components/ErrorBoundary";

// Import mock data
import { images, imageTags } from "../mockData/imagesMock";

// Gallery Image Component
const GalleryImage = ({ image }) => (
  <Item
    original={image.image}
    thumbnail={image.thumbnail}
    width={image.width}
    height={image.height}
    title={image.title}
    caption={image.description}
  >
    {({ ref, open }) => (
      <Card
        className="gallery-card border-0 shadow-sm h-100"
        style={{ cursor: "pointer" }}
      >
        <Card.Img
          ref={ref}
          onClick={open}
          src={image.thumbnail}
          alt={image.title}
          className="gallery-image rounded"
          style={{
            transition: "transform 0.2s ease-in-out",
            objectFit: "cover",
            aspectRatio: "1",
          }}
        />
        <Card.Body className="p-2 text-center">
          <Card.Title className="text-truncate mb-0 small">
            {image.title}
          </Card.Title>
        </Card.Body>
      </Card>
    )}
  </Item>
);

GalleryImage.propTypes = {
  image: PropTypes.shape({
    image: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

// Tags Section Component
const TagsSection = ({ tags }) => (
  <div className="mt-5 text-center">
    <h2 className="h4 mb-4">Browse by Tag</h2>
    <Row className="justify-content-center mt-2 g-2">
      {tags.map((tag) => (
        <Col xs="auto" key={tag}>
          <Link
            to={`/gallery/${tag}`}
            className="btn btn-outline-primary tag-button"
            style={{
              transition: "all 0.2s ease-in-out",
              borderRadius: "20px",
              padding: "0.5rem 1rem"
            }}
          >
            {tag}
          </Link>
        </Col>
      ))}
    </Row>
  </div>
);

TagsSection.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const MockGalleryScreen = () => {
  const sortedImages = useMemo(() => {
    return [...images].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, []);

  return (
    <ErrorBoundary>
      <Container className="my-4">
        <Row className="align-items-center mb-5">
          <Col className="text-center">
            <h1 className="display-5 fw-bold mb-2">Photo Gallery</h1>
            <p className="text-muted lead">
            </p>
          </Col>
          <hr className="my-3" />
        </Row>

        <Gallery withCaption>
          <Row className="g-4">
            {sortedImages.map((image) => (
              <Col key={image._id} xs={6} sm={4} md={3} lg={3} xl={2}>
                <GalleryImage image={image} />
              </Col>
            ))}
          </Row>
        </Gallery>

        {imageTags && imageTags.length > 0 && <TagsSection tags={imageTags} />}
      </Container>
    </ErrorBoundary>
  );
};

export default MockGalleryScreen;
