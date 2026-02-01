'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatAddress } from '@/utils/payment';

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: Date;
  image?: string;
}

interface UserProfile {
  address: string;
  displayName: string;
  bio: string;
  followers: number;
  following: number;
}

// Mock data
const mockProfile: UserProfile = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  displayName: 'CryptoArtist',
  bio: 'Digital artist exploring the intersection of technology and creativity',
  followers: 1234,
  following: 567,
};

const mockPosts: Post[] = [
  {
    id: 1,
    author: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    content: 'Just listed my new collection "Cosmic Dreams" on the marketplace! Check it out! 🎨✨',
    likes: 42,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    author: '0x1234567890abcdef1234567890abcdef12345678',
    content: 'Amazing work by the community! The creativity here is inspiring.',
    likes: 28,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 3,
    author: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    content: 'Working on something special. Sneak peek coming soon... 👀',
    likes: 65,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export default function SocialPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      author: mockProfile.address,
      content: newPost,
      likes: 0,
      timestamp: new Date(),
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHrs > 0) return `${diffHrs}h ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Social Platform</h1>
          <p className="text-gray-600">
            Connect with artists and collectors in the community
          </p>
        </header>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{mockProfile.displayName}</h2>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {formatAddress(mockProfile.address)}
              </code>
              <p className="mt-3 text-gray-700">{mockProfile.bio}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold">{mockProfile.followers}</span>{' '}
              <span className="text-gray-600">Followers</span>
            </div>
            <div>
              <span className="font-semibold">{mockProfile.following}</span>{' '}
              <span className="text-gray-600">Following</span>
            </div>
          </div>
        </div>

        {/* Create Post */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Share something</h3>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handlePost}
            disabled={!newPost.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(post.author)}
                  </code>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>
              <p className="text-gray-800 mb-4">{post.content}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  💬 Comment
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  🔄 Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
