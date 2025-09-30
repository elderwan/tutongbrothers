// import { Request, Response } from "express";
// import Todo, { ITodo } from "../models/Todo";
// import ApiResponse from "../utils/Response";

// export const getAllTodo = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const orignalData = await Todo.find({ isDeleted: false });
//         const todos: ITodo[] = orignalData;
//         console.log("todo db", Todo.collection.name);
//         console.log("todo find", orignalData);
//         const response = ApiResponse.success("get todo list success!", 200, todos);
//         res.json(response);
//     } catch (error) {
//         console.error("fail to fetch the todos:", error);
//         const response = ApiResponse.internalError("fail to fetch the todos");
//         res.status(500).json(response);
//     }
// };

// export const createTodo = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { todo } = req.body;

//         if (!todo) {
//             const response = ApiResponse.badRequest("the todo is required");
//             res.status(400).json(response);
//             return;
//         }

//         const newTodo = new Todo({ todo });
//         await newTodo.save();

//         const response = ApiResponse.success("create todo success", 201, newTodo);
//         res.status(201).json(response);
//     } catch (error) {
//         console.error("fail to create todo:", error);
//         const response = ApiResponse.internalError("fail to create todo");
//         res.status(500).json(response);
//     }
// };
