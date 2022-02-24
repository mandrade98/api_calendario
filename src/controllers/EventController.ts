import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import { IEvent } from "../interfaces/Event";

export class EventController {
    async save(request: Request, response: Response) {
        const body = request.body as IEvent;
        let { name, description, date } = body;

        if (!name || !date) {
            return response.status(400).json({
                status: 400,
                message: "Informe todos os parâmetros obrigatórios",
                data: {},
            });
        }

        if (date) {
            date = new Date(date);
            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
        }

        try {
            const event = await prismaClient.event.create({
                data: {
                    name,
                    description,
                    date,
                },
            });

            return response.status(201).json({
                status: 201,
                message: "Cadastro realizado com sucesso",
                data: event,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                return response.status(400).json({
                    status: 400,
                    message: "Ops... formato de dados inválidos",
                    data: {},
                });
            }
            return response.status(500).json({
                status: 500,
                message: "Algo não ocorreu bem por aqui",
                data: {},
            });
        }
    }

    async delete(request: Request, response: Response) {
        const { id } = request.body;

        if (!id) {
            return response.status(400).json({
                status: 400,
                message: "Informe o id do evento",
                data: {},
            });
        }

        try {
            const eventExists = await prismaClient.event.findUnique({
                where: { id },
            });

            if (!eventExists) {
                return response.status(400).json({
                    status: 400,
                    message:
                        "Id do evento informado não foi encontrado, tente outro",
                    data: {},
                });
            }

            const event = await prismaClient.event.findUnique({
                where: { id },
            });

            const eventParticipant =
                await prismaClient.eventParticipant.findMany({
                    where: { id_event: event?.id },
                });

            if (eventParticipant.length > 0) {
                return response.status(400).json({
                    status: 400,
                    message: "Não é possivel remover evento com participante",
                    data: {},
                });
            }

            await prismaClient.event.delete({ where: { id } });

            return response.status(200).json({
                status: 200,
                message: "Evento deletado com sucesso",
                data: {},
            });
        } catch (error) {
            return response.status(500).json({
                status: 500,
                message: "Algo não ocorreu bem por aqui",
                data: {},
            });
        }
    }

    async update(request: Request, response: Response) {
        const body = request.body as IEvent;
        let { name, description, date } = body;
        const { id } = request.body;

        if (!name || !date) {
            return response.status(400).json({
                status: 400,
                message: "Informe todos os parâmetros obrigatórios",
                data: {},
            });
        }

        if (date) {
            date = new Date(date);
            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
        }

        try {
            const eventExists = await prismaClient.event.findUnique({
                where: { id },
            });

            if (!eventExists) {
                return response.status(400).json({
                    status: 400,
                    message:
                        "Id do evento informado não foi encontrado, tente outro",
                    data: {},
                });
            }

            await prismaClient.event.updateMany({
                where: {
                    id,
                },
                data: { name, description, date },
            });

            return response.status(200).json({
                status: 200,
                message: "Evento atualizado com sucesso",
                data: {},
            });
        } catch (error) {
            return response.status(500).json({
                status: 500,
                message: "Algo não ocorreu bem por aqui",
                data: {},
            });
        }
    }

    async list(request: Request, response: Response) {
        try {
            const events = await prismaClient.event.findMany();
            return response.status(200).json({
                status: 200,
                message: "Consulta realizada com sucesso",
                data: events,
            });
        } catch (error) {
            return response.status(500).json({
                status: 500,
                message: "Algo não ocorreu bem por aqui",
                data: {},
            });
        }
    }

    async listById(request: Request, response: Response) {
        const id = request?.query?.id as string;
        if (!id) {
            return response.status(400).json({
                status: 400,
                message: "Informe um Id do evento",
                data: {},
            });
        }

        try {
            const event = await prismaClient.event.findUnique({
                where: { id },
            });
            if (!event) {
                return response.status(400).json({
                    status: 400,
                    message:
                        "Id do evento informado não foi encontrado, tente outro",
                    data: {},
                });
            }
            return response.status(200).json({
                status: 200,
                message: "Consulta realizada com sucesso",
                data: event,
            });
        } catch (error) {
            return response.status(500).json({
                status: 500,
                message: "Algo não ocorreu bem por aqui",
                data: {},
            });
        }
    }
}
