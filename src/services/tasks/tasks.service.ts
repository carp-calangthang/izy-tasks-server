import { Request, Response } from "express";
import { tasks, tasksVariables } from "../../controllers/tasks/dto";
import tasksPanigation from "../../controllers/tasks/taskPanigation";
import { CreateTask, UpdateTask } from "../../controllers/tasks/taskManager";

export class TasksService {

    async tasksPagination (req: Request, res: Response) {
        try {
            const {
                where,
                skip = 0,
                take = 10,
            }: tasksVariables = req.body;
            const tasksList = await tasksPanigation({
                where,
                skip,
                take
            });
            res.status(tasksList.statusCode).json(tasksList.data)

        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async createTask (req: Request, res: Response) {
        try {
            const {
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            }: tasks = req.body;
            const result = await CreateTask({
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            });
            res.status(result.statusCode).json(result.message)

        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async updateTask (req: Request, res: Response) {
        try {
            const {
                id,
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            }: tasks = req.body;
            
            if (!id) {
                return res.status(400).json({ message: "Task ID is required for update" });
            }

            const result = await UpdateTask({
                id,
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            })
            res.status(result.statusCode).json(result.message)

        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
        }
    }

}