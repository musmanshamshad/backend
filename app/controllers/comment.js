const models = require("../../models");
const errorFormatter = require("../../utils/errorFormatter");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        snackId,
        chapterId,
        content,
        noteId,
        commentId,
        loId,
        library = false,
      } = req.body;

      if (!snackId && !chapterId) {
        return next(
          errorFormatter(
            "snackId | chapterId",
            "required fields - snackId or chapterId is required",
            "Please provide a snackId or chapterId"
          )
        );
      }

      const comment = await models.comment.save({
        snackId,
        chapterId,
        content,
        userId: req.user,
        noteId,
        commentId,
        loId,
        library,
      });

      return res.json({
        data: comment,
        error: false,
        response: "Comment added successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const { resourceId } = req.params;
      const { resource = "chapter", library = false } = req.query;
      let options = {
        where: {
          userId: req.user,
          library
        },
        include: [
          {
            model: resource === "chapter" ? models.chapter : models.snack,
          },
        ],
      };

      if (resource === "chapter") {
        options.where["chapterId"] = parseInt(resourceId, 10);
      } else if (resource === "snack") {
        options.where["snack"] = parseInt(resourceId, 10);
      } else if (resource === "note") {
        options.where["noteId"] = parseInt(resourceId, 10);
      } else if (resource === "id") {
        options.where["id"] = parseInt(resourceId, 10);
      } else if (resource === "learnobjective") {
        options.where["loId"] = parseInt(resourceId, 10);
      }

      const comments = await models.comment.findAll(options);

      return res.json({
        data: comments,
        error: false,
        response: null,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const { resourceId } = req.params;
      const { resource = "chapter" } = req.query;
      let options = {
        where: {
          userId: req.user,
        },
      };

      if (resource === "chapter") {
        options.where["chapterId"] = parseInt(resourceId, 10);
      } else if (resource === "snack") {
        options.where["snackId"] = parseInt(resourceId, 10);
      } else if (resource === "note") {
        options.where["noteId"] = parseInt(resourceId, 10);
      } else if (resource === "id") {
        options.where["id"] = parseInt(resourceId, 10);
      } else if (resource === "comment") {
        options.where["commentId"] = resourceId;
      } else if (resource === "learnobjective") {
        options.where["loId"] = parseInt(resourceId, 10);
      }
      await models.comment.removeComment(options);

      return res.json({
        data: null,
        error: false,
        response: "Comment  removed successfully",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id, commentId, content } = req.body;

      if (!id && !commentId) {
        return next(
          errorFormatter(
            "id | commentId",
            "required fields - commentId or id is required",
            "Please provide a id or commentId"
          )
        );
      }

      let where = {
        userId: req.user,
      };
      let data = {
        content,
      };

      if (commentId) {
        where.commentId = commentId;
      } else if (id) {
        where.id = id;
      }
      const updatedComment = await models.comment.updateComment(where, data);
      return res.json({
        data: updatedComment,
        error: false,
        response: "Comment updated successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
};
