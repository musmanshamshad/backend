const models = require("../../models");
const errorFormatter = require("../../utils/errorFormatter");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { snackId, chapterId, content, noteId, loId } = req.body;

      if (!snackId && !chapterId) {
        return next(
          errorFormatter(
            "snackId | chapterId",
            "required fields - snackId or chapterId is required",
            "Please provide a snackId or chapterId"
          )
        );
      }

      const highlighted = await models.highlight.save({
        snackId,
        chapterId,
        content,
        userId: req.user,
        noteId,
        loId,
      });

      return res.json({
        data: highlighted,
        error: false,
        response: "Text highlighted successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  listHighlights: async (req, res, next) => {
    try {
      const { resourceId } = req.params;
      const { resource = "chapter" } = req.query;
      let options = {
        where: {
          userId: req.user,
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
      } else if (resource === "learnobjective") {
        options.where["loId"] = parseInt(resourceId, 10);
      }

      const highlights = await models.highlight.findAll(options);

      return res.json({
        data: highlights,
        error: false,
        response: null,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  deleteHighlights: async (req, res, next) => {
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
      } else if (resource === "learnobjective") {
        options.where["loId"] = parseInt(resourceId, 10);
      }
      await models.highlight.removeHighlight(options);

      return res.json({
        data: null,
        error: false,
        response: "Highlight  removed successfully",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  updateHlight: async (req, res, next) => {
    try {
      const { content } = req.body;
      let where = {
        userId: req.user,
        id: req.params.id,
      };
      let data = {
        content,
      };
      const highlighted = await models.highlight.updateHlight(where, data);
      return res.json({
        data: highlighted,
        error: false,
        response: "Highlighted text successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
};
