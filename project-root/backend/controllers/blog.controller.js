import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import logActivity from '../utils/logActivity.js';

// ----------------------------------------------
// CREATE POST (with demo user content enforcement)
// ----------------------------------------------
export const createPost = async (req, res) => {
  // Demo template to enforce for demo users
  const demoPostTemplate = {
    title: 'Demo Title by User',
    body: 'This is a predefined demo post content to simulate a user-generated blog post.',
  };

  try {
    const isDemoUser = req.user?.isDemoUser;

    // Use template if demo user, else use req.body values
    const title = isDemoUser ? demoPostTemplate.title : req.body.title;
    const body = isDemoUser ? demoPostTemplate.body : req.body.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'All fields must be provided' });
    }

    const newPost = new Blog({
      title,
      body,
      author: req.user._id,
    });

    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate('author', '_id username');

    await logActivity({
      userId: req.user._id,
      action: 'create_post',
      blogId: savedPost._id,
      req,
      details: { title },
    });

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Post already exists (duplicate)' });
    }

    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/*
export const createPost = async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'All fields must be provided' });
  }

  try {
    const newPost = new Blog({
      title,
      body,
      author: req.user._id,
    });

    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate('author', '_id username');

    await logActivity({
      userId: req.user._id,
      action: 'create_post',
      blogId: savedPost._id,
      req,
      details: { title },
    });

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Post already exists (duplicate)' });
    }

    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
*/

// ----------------------------------------------
// UPDATE POST (with demo user content enforcement)
// ----------------------------------------------
export const patchPost = async (req, res) => {
  // Demo template for demo users
  const demoPostTemplate = {
    title: 'Demo Title by User',
    body: 'This is a predefined demo post content to simulate a user-generated blog post.',
  };

  const postId = req.params.id;

  try {
    const isDemoUser = req.user?.isDemoUser;

    // For demo users, override title and body with template even if user sends something else
    const title = isDemoUser ? demoPostTemplate.title : req.body.title;
    const body = isDemoUser ? demoPostTemplate.body : req.body.body;

    // Require at least one field (title or body) after override
    if (!title && !body) {
      return res
        .status(400)
        .json({ error: 'At least one field (title or body) must be provided' });
    }

    // If both title and body are provided (and user is NOT demo), check duplicates
    if (!isDemoUser && title && body) {
      const existingPost = await Blog.findOne({
        title,
        body,
        _id: { $ne: postId },
      });
      if (existingPost) {
        return res
          .status(400)
          .json({ error: 'Post with same title and body already exists' });
      }
    }

    // Build updateData depending on provided fields (forced for demo users)
    const updateData = {};
    if (title) updateData.title = title;
    if (body) updateData.body = body;

    const updatedPost = await Blog.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    }).populate('author', 'username');

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await logActivity({
      userId: req.user._id,
      action: 'update_post',
      blogId: postId,
      req,
      details: { updatedFields: Object.keys(updateData) },
    });

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Patch post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/*
export const patchPost = async (req, res) => {
  const { title, body } = req.body;
  const postId = req.params.id;

  if (!title && !body) {
    return res
      .status(400)
      .json({ error: 'At least one field (title or body) must be provided' });
  }

  try {
    if (title && body) {
      const existingPost = await Blog.findOne({
        title,
        body,
        _id: { $ne: postId },
      });
      if (existingPost) {
        return res
          .status(400)
          .json({ error: 'Post with same title and body already exists' });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (body) updateData.body = body;

    const updatedPost = await Blog.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    }).populate('author', 'username');

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await logActivity({
      userId: req.user._id,
      action: 'update_post',
      blogId: postId,
      req,
      details: { updatedFields: Object.keys(updateData) },
    });

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Patch post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
*/

// -------------------
// THE REST REMAINS SAME
// -------------------

export const getPosts = async (req, res) => {
  try {
    const { title } = req.query;

    const query = { isDeleted: false };
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const posts = await Blog.find(query).populate('author', 'username');
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Post not found' });
  }

  try {
    const post = await Blog.findOne({ _id: id, isDeleted: false }).populate(
      'author',
      'username'
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete this post' });
    }

    if (post.isDeleted) {
      return res.status(400).json({ error: 'Post already deleted' });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    await logActivity({
      userId: req.user._id,
      action: 'delete_post',
      blogId: post._id,
      req,
      details: { title: post.title },
    });

    res
      .status(200)
      .json({ success: true, message: 'Post soft deleted', data: post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const restorePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to restore this post' });
    }

    if (!post.isDeleted) {
      return res.status(400).json({ error: 'Post is not deleted' });
    }

    post.isDeleted = false;
    post.deletedAt = null;
    await post.save();

    await logActivity({
      userId: req.user._id,
      action: 'restore_post',
      blogId: post._id,
      req,
      details: { title: post.title },
    });

    res
      .status(200)
      .json({ success: true, message: 'Post restored', data: post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostsByUser = async (req, res) => {
  const userId = req.params.userId;
  const { title } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const query = {
      author: userId,
      isDeleted: false,
    };

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const posts = await Blog.find(query).populate('author', 'username');

    await logActivity({
      userId: req.user._id,
      action: 'view_user_posts',
      req,
      details: {
        viewedUserId: userId,
        filter: title || null,
      },
    });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Fetch posts by user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
