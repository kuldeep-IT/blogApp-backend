import Blog from "../model/Blog.js";
import User from "../model/User.js";

const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (error) {
        console.log("getAllBlogs error: ", error)
    }

    if (!blogs) {
        return res.status(404).json({
            message: "No blog found"
        })
    }

    return res.status(200).json({
        message: "Blogs received successfully!",
        blogs
    })
}

const addBlog = async (req, res, next) => {

    const { title, description, image, user } = req.body

    let existingUser;
    try {
        existingUser = await User.findById(user)
    } catch (error) {
        return console.log("addBlog error: ", error)
    }

    if (!existingUser) {
        return res.status(400).json({
            message: "Unable to find user by this id"
        })
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    })

    try {
        // await blog.save();

        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });

        // add the blog in user's  blog array as well
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();

    } catch (error) {
        console.log("addBlog error: ", error);
        return res.status(500).json({ message: "Internal server error", error })
    }

    return res.status(201).json({
        message: "Blog added successfully",
        blog
    })
}

const updateBlog = async (req, res, next) => {
    const { id } = req.params;

    const { title, description } = req.body;

    let blog;

    try {
        blog = await Blog.findByIdAndUpdate(id, {
            title,
            description
        })

        return res.status(200).json({
            message: "Blog updated successfully",
            blog
        })

    } catch (error) {
        console.log("updateBlog error: ", error)
        return res.status(500).json({
            message: "Unable to update blog"
        })
    }


}

const getBlogById = async (req, res, next) => {
    const { id } = req.params;
    let blog;

    try {
        blog = await Blog.findById(id);
    } catch (error) {
        return console.log("getBlogById error: ", error)
    }

    if (!blog) {
        return res.status(404).json({
            message: "No blog found"
        })
    }

    return res.status(200).json({
        blog
    })
}

const deleteBlog = async (req, res, next) => {

    const { id } = req.params;

    let blog;

    try {
        blog = await Blog.findByIdAndDelete(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        return console.log("deleteBlog error: ", error)
    }

    if (!blog) {
        return res.status(500).json({
            message: "Unable to find Blog!!"
        })
    }

    return res.status(200).json({
        message: "Blog deleted successfully!!",
    })
}

const getBlogsByUserId = async (req, res, next) => {
    const id = req.params.id

    let userWithBlogs;
    try {
        userWithBlogs = await User.findById(id).populate("blogs");

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }

    if (!userWithBlogs) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        blogs: userWithBlogs.blogs
    })

}

export {
    getAllBlogs,
    addBlog,
    updateBlog,
    getBlogById,
    deleteBlog
}