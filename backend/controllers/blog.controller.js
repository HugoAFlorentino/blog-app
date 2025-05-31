import Blog from '../models/Blog.js';

// CREATE POST DUPLICATED INDEX VERIFICATION IS TRUE
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
    const populatedPost = await savedPost.populate('author', 'username');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Post already exists (duplicate)' });
    }

    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE POST
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

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Patch post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET POSTS ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Blog.find({ isDeleted: false }).populate(
      'author',
      'username'
    );
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET POST BY ID
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

// SOFT DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership or admin
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

    // Soft delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    res
      .status(200)
      .json({ success: true, message: 'Post soft deleted', data: post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// RESTORE DELETED POST
export const restorePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership or admin
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

    res
      .status(200)
      .json({ success: true, message: 'Post restored', data: post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET POSTS BY USER

export const getPostsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find posts by author (adjust the field name if different)
    const posts = await Post.find({ author: userId, isDeleted: false });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Fetch posts by user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
