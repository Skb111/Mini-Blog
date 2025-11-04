import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById, updateBlog } from "../controller/blogController";
import requireAuth from "../middleware/authMiddleware";
import upload from "../utils/uploader";
import requireAdmin from "../middleware/requireAdmin";

const router = Router();

/**
 * @openapi
 * /api/blogs:
 *   get:
 *     summary: Retrieve a list of blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A list of blog posts
 */
router.get("/blogs", getAllBlogs);

/**
 * @openapi
 * /api/blogs/{id}:
 *   get:
 *     summary: Retrieve a single blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog post ID
 *     responses:
 *       200:
 *         description: A single blog post
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getBlogById);

/**
 * @openapi
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/CreateBlog",requireAuth, requireAdmin, upload.single("image"), createBlog);

/**
 * @openapi
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.put("/:id", requireAuth, requireAdmin, upload.single("image"), updateBlog);

export default router;
