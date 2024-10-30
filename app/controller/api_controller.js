import { validationResult } from "express-validator";

export function getAll(app) {
  return async (req, res, next) => {
    app.repository.todoRepository.getAll().then((data) => console.log(data));

    res.write("Je suis dans le controller \n");
    res.send();

    // res.json({
    //     message: "Hello monde incroyable de gens beaux"
    // })
  };
}

export function getOne(app) {
  return async (req, res, next) => {
    app.repository.todoRepository
      .getOne(parseInt(req.params.id) || 0)
      .then((data) => console.log(data));

    res.write("Je suis dans le controller \n");
    res.send();

    // res.json({
    //     message: "Hello monde incroyable de gens beaux"
    // })
  };
}

export function postThings() {
  return async (req, res, next) => {
    // console.log(req.body)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors.array());
    }

    console.log(req.body);

    res.status(201);
    res.send();
  };
}
