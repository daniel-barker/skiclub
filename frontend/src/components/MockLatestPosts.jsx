import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

// Mock data for latest posts
const mockLatestPosts = [
  {
    _id: '1',
    title: 'Looking for ski partners this weekend',
    body: '<p>Anyone planning to ski this weekend? Looking for company on the slopes!</p>',
    createdAt: '2025-03-20T14:30:00Z',
    user: {
      _id: '67f6c0b05a8f631d3bc66a37',
      name: 'Regular User'
    },
    isApproved: true
  },
  {
    _id: '2',
    title: 'Selling ski equipment',
    body: '<p>I have some lightly used ski equipment for sale. DM me if interested.</p>',
    createdAt: '2025-03-15T10:15:00Z',
    user: {
      _id: '67f6c0b05a8f631d3bc66a36',
      name: 'Admin User'
    },
    isApproved: true
  },
  {
    _id: '3',
    title: 'Potluck dinner this Friday',
    body: '<p>Hosting a potluck dinner at the lodge this Friday at 7pm. Everyone welcome!</p>',
    createdAt: '2025-03-10T09:45:00Z',
    user: {
      _id: '67f6c0b05a8f631d3bc66a37',
      name: 'Regular User'
    },
    isApproved: true
  }
];

const MockLatestPosts = () => {
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
    <Card className="bulletin-board-card">
      <Card.Header className="bulletin-board-card-header">
        Latest Bulletin Board Posts
      </Card.Header>
      <Card.Body className="latest-posts-card-body">
        {mockLatestPosts.map((post) => (
          <div key={post._id} className="bulletin-post">
            <Card.Title className="bulletin-post-title mt-2">
              {post.title}
            </Card.Title>
            <div className="bulletin-post-user">
              Posted by: {post.user?.name}
            </div>
            <div
              className="bulletin-post-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.body),
              }}
            />
            <div className="bulletin-post-date">
              {formatDate(post.createdAt)}
            </div>
          </div>
        ))}
      </Card.Body>
      <Card.Footer className="text-center">
        <Link to="/bb" className="btn btn-outline-primary">
          See Details and Older Posts
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default MockLatestPosts;
