const moment = require("moment")
const randomstring = require("randomstring")

const BlogPostModel = require("../../models/post.js")

module.exports = {
  getAllBlogPosts: function(callback) {
    const now = moment().unix()

    BlogPostModel.find({dateTimestamp: {$lte: now}}, "title id dateTimestamp tags")
    .sort({dateTimestamp: -1})
    .exec(function(activePostsError, activePosts) {
      if (activePostsError) {
        callback({getDataError: true})
      } else {
        BlogPostModel.find({dateTimestamp: {$gte: now}}, "title id dateTimestamp tags")
        .sort({dateTimestamp: -1})
        .exec(function(upcomingPostsError, upcomingPosts) {
          if (upcomingPostsError) {
            callback({getDataError: true})
          } else {
            callback({
              success: true,
              activePosts: activePosts,
              upcomingPosts: upcomingPosts
            })
          }
        })
      }
    })
  },
  createNewBlogPost: function(title, urlTitle, dateTimestamp, tags, thumbnailImageUrl, markdownContent, seoTitleTag, seoMetaDescription, callback) {
    BlogPostModel.findOne({$or: [{title: title}, {urlTitle: urlTitle}]}).exec(function(error, post) {
      if (error) {
        callback({submitError: true})
      } else if (post) {
        callback({alreadyExistsError: true})
      } else {
        const arrayOfTags = tags.split(",").map(function(tag) {
          return tag.trim()
        })

        const newBlogPost = new BlogPostModel({
          id: randomstring.generate(12),
          title: title,
          urlTitle: urlTitle,
          dateTimestamp: dateTimestamp,
          tags: arrayOfTags,
          thumbnailImageUrl: thumbnailImageUrl,
          markdownContent: markdownContent,
          seoTitleTag: seoTitleTag,
          seoMetaDescription:seoMetaDescription
        })

        newBlogPost.save(function(saveError) {
          if (saveError) {
            callback({submitError: true})
          } else {
            callback({success: true})
          }
        })
      }
    })
  },
  getBlogPostById: function(id, callback) {
    BlogPostModel.findOne({id: id}).exec(function(error, post) {
      if (error) {
        callback({getDataError: true})
      } else if (!post) {
        callback({notFoundError: true})
      } else {
        callback({success: true, post: post})
      }
    })
  },
  editBlogPost: function(id, title, urlTitle, dateTimestamp, tags, thumbnailImageUrl, markdownContent, seoTitleTag, seoMetaDescription, callback) {
    const arrayOfTags = tags.split(",").map(function(tag) {
      return tag.trim()
    })

    BlogPostModel.findOneAndUpdate(
      {id: id},
      {$set: {
        title: title,
        urlTitle: urlTitle,
        dateTimestamp: dateTimestamp,
        tags: arrayOfTags,
        thumbnailImageUrl: thumbnailImageUrl,
        markdownContent: markdownContent,
        seoTitleTag: seoTitleTag,
        seoMetaDescription:seoMetaDescription
      }}
    ).exec(function(error, post) {
      if (error) {
        callback({submitError: true})
      } else if (!post) {
        callback({notFoundError: true})
      } else {
        callback({success: true})
      }
    })
  },
  deleteBlogPost: function(id, callback) {
    BlogPostModel.findOneAndRemove({id: id}).exec(function(error, post) {
      if (error || !post) {
        callback({submitError: true})
      } else {
        callback({success: true})
      }
    })
  }
}
