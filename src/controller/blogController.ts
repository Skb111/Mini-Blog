import type { Response } from 'express';
import Blog from '../model/Blog';
import type { AuthRequest } from '../middleware/authMiddleware';
// import validator from '../utils/validator';

// Create a new blog post
export async function createBlog(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { title, content } = req.body as { title: string; content: string };
    if (!title || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    // console.log("Creating blog with image URL:", imageUrl);
    // console.log("File received:", req.file);
    // console.log("Body received:", req.body);

    const savedBlog = await Blog.create({
      title,
      content,
      imageUrl,
      author: req.userId,
    });
    return res.status(201).json(savedBlog);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Get all blog posts
export async function getAllBlogs(req: AuthRequest, res: Response) {
  try {
    const blogs = await Blog.find().populate('author', 'username email').sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to list blogs' });
  };
}

// Get a single blog post by ID
export async function getBlogById(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findById(id).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get blog' });
  };
}

// Update a blog post by ID
export async function updateBlog(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, content } = req.body as { title?: string; content?: string };
    if (typeof title === "string") blog.title = title;
    if (typeof content === "string") blog.content = content;
    if (req.file) {
      blog.imageUrl = `/uploads/${req.file.filename}`;
    }
    await blog.save();
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update blog' });
  };
};

// Delete a blog post by ID
export async function deleteBlog(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await blog.deleteOne();
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete blog' });
  }
}


