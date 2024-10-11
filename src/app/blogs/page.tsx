"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";


interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured: boolean;
  imageUrl: string | null;
  author: {
    id: string;
    email: string;
  };
  createdAt: Date;
}

const BlogCustomerView: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Use tRPC to fetch blog posts
  const { data, error, isLoading: queryLoading } = api.blog.listAllPosts.useQuery();

  useEffect(() => {
    if (data) {
      setBlogPosts(data);
      setIsLoading(false);
    } else if (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [data, error]);

  // Handle loading state
  if (isLoading || queryLoading) {
    return <p>Loading blog posts...</p>;
  }

  // Handle error state
  if (isError) {
    return <p>Error fetching blog posts. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>

      {blogPosts.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="p-6 rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.content}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="mb-4 max-w-full h-auto"
                />
              )}

              <p className="text-gray-500">
                <strong>Author:</strong> {post.author.email}
              </p>
              <p className="text-gray-500">
                <strong>Posted on:</strong> {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {/* Read-only feature star */}
              <div className="text-yellow-500 text-2xl">
                {post.featured ? "★ Featured" : "☆"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogCustomerView;
