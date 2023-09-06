const models = require("../../models");
const errorFormatter = require("../../utils/errorFormatter");
module.exports = {
  create: async (req, res, next) => {
    try {
      const { title } = req.body;
      const createdTag = await models.tag.save({ title });
      return res.json({
        data: createdTag,
        error: false,
        response: "Tag added successfully.",
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const tags = await models.tag.list();
      return res.json({
        data: tags,
        error: false,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },

  // Fetch content by snackId and tagId
  fetchContentOfTagBySnackId: async (req, res, next) => {
    try {
      const { snackId, tagId } = req.query;
      if (!snackId || !tagId) {
        return res.status(400).send({
          statusCode: 400,
          message: `Invalid query params! Either snackId or tagId is missing.`,
          data: {},
        });
      }

      const content = await models.note.findOne({
        where: {
          tagId: tagId,
          snackId: snackId,
        },
      });
      if (!content) {
        return res.status(200).send({
          statusCode: 204,
          message: `Content not available against such query.`,
          data: {},
        });
      }
      return res.status(200).send({
        statusCode: 200,
        message: `Content fetched successfully!`,
        data: content,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },

  //Fecth content by chapterId and tagId
  fetchContentOfTagByChapterId: async (req, res, next) => {
    try {
      const { chapterId, tagId } = req.query;
      if (!chapterId || !tagId) {
        return res.status(400).send({
          statusCode: 400,
          message: `Invalid query params! Either snackId or tagId is missing.`,
          data: {},
        });
      }

      const content = await models.note.findOne({
        where: {
          tagId: tagId,
          chapterId: chapterId,
        },
      });
      if (!content) {
        return res.status(200).send({
          statusCode: 204,
          message: `Content not available against such query.`,
          data: {},
        });
      }
      return res.status(200).send({
        statusCode: 200,
        message: `Content fetched successfully!`,
        data: content,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { title } = req.body;
      const { tagId } = req.params;
      const prevData = await models.tag.findOne({
        where: { title: title.toLowerCase() },
        raw: true,
      });

      if (
        (prevData && prevData.id && prevData.id === parseInt(tagId), 10) ||
        !prevData
      ) {
        const updatedData = await models.tag.updateTag(tagId, {
          title: title.toLowerCase(),
        });
        return res.json({
          data: updatedData,
          error: false,
        });
      }
    } catch (error) {
      console.log({ error });
      next(error);
    }
  },
  removeTag: async (req, res, next) => {
    try {
      const { tagId } = req.params;
      const prevData = await models.tag.deleteTag(tagId);

      return res.json({
        data: prevData,
        error: false,
        response: "Tag deleted successfully",
      });
    } catch (error) {
      console.log(">>", { error });
      next(error);
    }
  },
};
