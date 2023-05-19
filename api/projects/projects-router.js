const express = require("express");

const {
  validateProjectId,
  validateProject,
  validateProjectPost,
} = require("./projects-middleware");

const router = express.Router();

const Project = require("./projects-model");

router.get("/", (req, res, next) => {
  Project.get()
    .then((project) => {
      res.json(project);
    })
    .catch(next);
});

router.get("/:id", validateProjectId, (req, res) => {
  res.json(req.project);
});

router.post("/", validateProject, (req, res, next) => {
  Project.insert({
    name: req.name,
    description: req.description,
    completed: req.completed,
  })
    .then((newProject) => {
      res.status(201).json(newProject);
    })
    .catch(next);
});

router.put("/:id", validateProjectId, validateProjectPost, (req, res, next) => {
  Project.update(req.params.id, {
    name: req.name,
    description: req.description,
    completed: req.completed,
  })
    .then(() => {
      return Project.get(req.params.id);
    })
    .then((project) => {
      res.json(project);
    })
    .catch(next);
});

router.delete("/:id", validateProjectId, (req, res, next) => {
  Project.remove(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  try {
    const result = await Project.getProjectActions(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "Something went wrong!",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
