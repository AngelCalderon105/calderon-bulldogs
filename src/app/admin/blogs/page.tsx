"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react"; // Adjust the import path based on your setup

// Define the type for the blog post
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

const BlogAdminPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  
  const { data, error, isLoading: queryLoading, refetch } = api.blog.listAllPosts.useQuery();

  
  const { mutateAsync: createPost } = api.blog.createPost.useMutation();
  const featurePostMutation = api.blog.featurePost.useMutation();
  const removePostMutation = api.blog.removePost.useMutation();

  useEffect(() => {
    if (data) {
      setBlogPosts(data); 
      setIsLoading(false);
    } else if (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [data, error]);

  // Handle creating a new post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageBase64: string | undefined;
      let fileName: string | undefined;
      let fileType: string | undefined;

      // Check if an image is selected and convert it to a base64 string
      if (imageFile) {
        fileName = imageFile.name;
        fileType = imageFile.type;

        const arrayBuffer = await imageFile.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64'); // Convert to Base64
        imageBase64 = base64String;
      }

      // Call the backend API to create the post and upload the image
      await createPost({
        title,
        content,
        featured,
        imageBase64,
        imageFileName: fileName,
        fileType: fileType,
        tags,
      });

      // Refetch the posts after creating a new one
      await refetch();
      // Clear the form fields
      setTitle('');
      setContent('');
      setFeatured(false);
      setImageFile(null);
      setTags([]);

      alert("Blog post created successfully!");
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert("Failed to create blog post. Please try again.");
    }
  };

  // Handle feature action
  const handleFeaturePost = async (postId: string, currentFeatured: boolean) => {
    try {
      await featurePostMutation.mutateAsync({ postId, featured: !currentFeatured });
      // Refetch the blog posts to get updated list
      await refetch();
    } catch (error) {
      console.error("Error featuring blog post:", error);
    }
  };

  // Handle remove action
  const handleRemovePost = async (postId: string) => {
    try {
      await removePostMutation.mutateAsync({ postId });
      // Refetch the blog posts after removing
      await refetch();
    } catch (error) {
      console.error("Error removing blog post:", error);
    }
  };

 
  if (isLoading || queryLoading) {
    return <p>Loading blog posts...</p>;
  }

  
  if (isError) {
    return <p>Error fetching blog posts. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Blog Posts</h1>

     
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Blog Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border rounded p-2"
              rows={6}
            />
          </div>
          <div>
            <label className="block mb-1">Featured</label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mr-2"
            />
            Feature this post
          </div>
          <div>
            <label className="block mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
              placeholder="Enter tags separated by commas"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Upload Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>
          <button type="submit" className="p-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>
      </div>

      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Existing Blog Posts</h2>

       
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

                {/* Feature or Remove Blog Post Actions */}
                <div className="flex space-x-4 mt-4">
                  {/* Toggle featured state using a star icon */}
                  <button
                    onClick={() => handleFeaturePost(post.id, post.featured)}
                    className="text-yellow-500 text-2xl"
                    aria-label={post.featured ? "Unfeature post" : "Feature post"}
                  >
                    {post.featured ? "★" : "☆"} {/* Star icon for feature */}
                  </button>

                  <button
                    onClick={() => handleRemovePost(post.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAdminPage;
