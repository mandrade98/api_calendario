import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import { IEventParticipant } from "../interfaces/EventParticipant";



export class EventParticipantController {
    async save(request: Request, response: Response) {
        const body = request.body as IEventParticipant
        let { idUser, idEvent } = body

        if (!idUser || !idEvent) {
            return response.status(400).json({ status: 400, message: "Informe todos os parâmetros obrigatórios", data: {} })
        }

        try {
            const event = await prismaClient.event.findUnique({ where: { id: idEvent } })
            if (!event) {
                return response.status(400).json({ status: 400, message: "Id do evento informado não foi encontrado, tente outro", data: {} })
            }

            const user = await prismaClient.user.findUnique({ where: { id: idUser } })
            if (!user) {
                return response.status(400).json({ status: 400, message: "Id do participante informado não foi encontrado, tente outro", data: {} })
            }

            const participantAlreadyRegistered = await prismaClient.eventParticipant.findMany({ where: { user } })
            if (participantAlreadyRegistered) {
                return response.status(409).json({ status: 409, message: "Usuário já está cadastrado no evento selecionado", data: {} })
            }

            const eventParticipant = await prismaClient.eventParticipant.create({
                data: {
                    id_user: idUser, id_event: idEvent
                }
            })

            return response.status(201).json({ status: 201, message: "Participante salvo", data: eventParticipant })
        } catch (error) {
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }

    async listByUserId(request: Request, response: Response) {
        const id = request?.query?.id as string

        if (!id) {
            return response.status(400).json({ status: 400, message: "Informe um Id de participante", data: {} })
        }

        try {
            const events = await prismaClient.eventParticipant.findMany({
                where: { id_user: id }, include: {
                    event: true
                }, orderBy: {
                    event: { date: 'asc' }
                }
            })
            if (!events) {
                return response.status(400).json({ status: 400, message: "Id do participante informado não foi encontrado, tente outro", data: {} })
            }
            return response.status(200).json({ status: 200, message: "Consulta realizada com sucesso", data: events })
        } catch (error) {
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }
}