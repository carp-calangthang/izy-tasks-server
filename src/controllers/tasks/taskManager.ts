import { tasks } from "./dto";
import prisma from '../../utils/connection/connection';
import { EnumData } from "../../constant/enumData";

const HandleStatus = ({status}) => {
    const statusInfo = EnumData.StatusType[status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];

    if (statusInfo) {
        return {
            name: statusInfo.name,
            color: statusInfo.color
        };
    }

    return null;
};

const CreateTask = async (
    {
        name,
        body,
        author,
        expirationDate,
        isExpiration,
        images,
        tags,
        projectId,
        team,
        employee
    }: tasks
) => {
    try {
        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!author) errors.push("author");
        if (!expirationDate) errors.push("expirationDate");
        if (images.length === 0) errors.push("images");
        if (tags.length === 0) errors.push("tags");

        if (errors.length > 0) {
            return { statusCode: 400, message: `The following fields are empty: ${errors.join(", ")}` };
        }

        const newTask = await prisma.tasks.create({
            data: {
                name,
                body,
                status: EnumData.StatusType.New.code,
                statusColor: EnumData.StatusType.New.color,
                statusName: EnumData.StatusType.New.name,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                projectId,
                team,
                employee
            },
        });

        if (newTask) {
            await prisma.taskHistory.create({
                data: {
                    taskId: newTask.id,
                    action: `Creat new task with name: '${name}'`,
                    changes: {
                        title: newTask.name,
                        body: newTask.body,
                        status: newTask.status,
                        statusColor: newTask.statusColor,
                        statusName: newTask.statusName,
                        author: newTask.author,
                        expirationDate: newTask.expirationDate,
                        images: newTask.images,
                        tags: newTask.tags,
                        projectId: newTask.projectId,
                        team: newTask.team,
                        employee: newTask.employee,
                    }
                }
            })
        }

        return { statusCode: 200, message: "Create new task successfully", task: newTask };

    } catch (error) {
        console.error('Error in CreateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const UpdateTask = async (
    {
        id,
        name,
        body,
        status,
        author,
        expirationDate,
        isExpiration,
        images,
        tags,
        projectId,
        team,
        employee
    }: tasks
) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for update" };
        }

        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!status) errors.push("status");
        if (!author) errors.push("author");
        if (!expirationDate) errors.push("expirationDate");
        if (images.length === 0) errors.push("images");
        if (tags.length === 0) errors.push("tags");

        if (errors.length > 0) {
            return { statusCode: 400, message: `The following fields are empty: ${errors.join(", ")}` };
        }

        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: {
                name,
                body,
                status,
                statusColor: HandleStatus({status}).color,
                statusName: HandleStatus({status}).name,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                projectId,
                team,
                employee
            },
        });

        // create history
        if (updatedTask) {
            await prisma.taskHistory.create({
                data: {
                    taskId: updatedTask.id,
                    action: `Update task with ID: '${id}'`,
                    changes: {
                        title: updatedTask.name,
                        body: updatedTask.body,
                        status: updatedTask.status,
                        statusColor: updatedTask.statusColor,
                        statusName: updatedTask.statusName,
                        author: updatedTask.author,
                        expirationDate: updatedTask.expirationDate,
                        images: updatedTask.images,
                        tags: updatedTask.tags,
                        project: updatedTask.projectId,
                        team: updatedTask.team,
                        employee: updatedTask.employee,
                    }
                }
            })
        }

        return { statusCode: 200, message: "Task updated successfully", task: updatedTask };
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const DeleteTask = async ({ id }) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for delete"}
        }

        await prisma.taskHistory.deleteMany({
            where: { taskId: id }
        });

        const deleteTask = await prisma.tasks.delete({
            where: {id: id}
        })

        // create history
        if (deleteTask) {
            await prisma.taskHistory.create({
                data: {
                    taskId: id,
                    action: `Delete task with id: '${id}'`,
                    changes: {}
                }
            })
        }

        return { statusCode: 200, message: `Task '${id}' has been delete!`}
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

export { CreateTask, UpdateTask, DeleteTask }