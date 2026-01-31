const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000)
});

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional()
});

module.exports = {
  createPostSchema,
  updatePostSchema
};
