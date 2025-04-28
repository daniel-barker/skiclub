import { Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import DOMPurify from "dompurify";

// Import mock data directly
const mockLatestNews = [
  {
    _id: '1',
    title: 'Winter Season Opening',
    post: '<p>The ski club will open for the winter season on December 1st. Get your gear ready!</p>',
    createdAt: '2025-03-15T12:00:00Z',
    updatedAt: '2025-03-15T12:00:00Z',
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=300'
  },
  {
    _id: '2',
    title: 'New Chairlift Installation',
    post: '<p>We are excited to announce the installation of a new high-speed chairlift for the upcoming season.</p>',
    createdAt: '2025-02-20T14:30:00Z',
    updatedAt: '2025-02-21T09:15:00Z',
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=300'
  },
  {
    _id: '3',
    title: 'Annual Member Meeting',
    post: '<p>The annual member meeting will be held on May 15th at the lodge. All members are encouraged to attend.</p>',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
    isPublished: true
  }
];

const MockLatestNews = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const formatDate = (datetime) => {
    const date = new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return date;
  };

  return (
    <>
    <Card className="home-news-card">
      <Card.Header className="home-news-card-header">Latest News</Card.Header>
      <Card.Body>
        {mockLatestNews.map((newsPost) => (
          <div key={newsPost._id} className="home-news-post d-flex">
            <div className="home-news-post-content">
              <Card.Title className="home-news-post-title">
                {newsPost.title}
              </Card.Title>
              <div
                className="home-news-post-text fs-5"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(newsPost.post),
                }}
              />
              <div className="home-news-post-date">
                {formatDate(newsPost.createdAt)}
              </div>
            </div>
            {newsPost.image && (
              <div className="home-news-post-image-container">
                <img
                  src={newsPost.thumbnail}
                  alt="News post"
                  className="home-news-post-image ms-2 cursor-pointer"
                  onClick={() => {
                    setSelectedImage(newsPost.image);
                    setShowModal(true);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        ))}
      </Card.Body>
      <Card.Footer className="text-center">
        <Link to="/news" className="btn btn-outline-primary">
          See More News
        </Link>
      </Card.Footer>
    </Card>
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>News Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="News post"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </Modal.Body>
    </Modal>
    </>
  );
};

export default MockLatestNews;
