import { useGetImagesByTagQuery } from "../slices/imageApiSlice";
import { useParams, Link } from "react-router-dom";
import { Col, Row, Container, Card, Spinner, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ErrorBoundary from "../components/ErrorBoundary";

// Loading Component
const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "50vh" }}
  >
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

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

const GalleryByTagScreen = () => {
  const { tag } = useParams();
  const { data: images, isLoading, error } = useGetImagesByTagQuery(tag);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        Error: {error?.data?.message || "Failed to load gallery images"}
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-5">
          <Col>
            <h1 className="text-center display-6 fw-bold">
              Photos Tagged: {tag}
            </h1>
            <p className="text-center">
              <Link to="/gallery" className="btn btn-outline-primary-custom">
                ← Back to Gallery
              </Link>
            </p>
          </Col>
        </Row>

        <Gallery withCaption>
          <Row className="g-4">
            {images.map((image) => (
              <Col key={image._id} xs={6} sm={4} md={3} lg={3} xl={2}>
                <GalleryImage image={image} />
              </Col>
            ))}
          </Row>
        </Gallery>
      </Container>
    </ErrorBoundary>
  );
};

export default GalleryByTagScreen;
