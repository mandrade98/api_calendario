import { prisma, Prisma } from "@prisma/client"
import { Request, Response } from "express"
import { prismaClient } from "../database/prismaClient"
import { IUser } from "../interfaces/User"

export class UserController {
    async save(request: Request, response: Response) {
        const body = request.body as IUser
        let { fullName, birthDate, emailAddress } = body

        if (!fullName || !emailAddress) {
            return response.status(400).json({ status: 400, message: "Informe todos os parâmetros obrigatórios", data: {} })
        }

        if (birthDate) {
            birthDate = new Date(birthDate)
        }

        try {
            const user = await prismaClient.user.create({
                data: {
                    full_name: fullName,
                    birth_date: birthDate,
                    email_address: emailAddress
                }
            })

            return response.status(201).json({ status: 201, message: "Cadastro realizado com sucesso", data: user })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return response.status(409).json({ status: 409, message: "Esse e-mail já foi cadastrado, tente outro", data: {} })
                }
            }
            if (error instanceof Prisma.PrismaClientValidationError) {
                return response.status(400).json({ status: 400, message: "Ops... formato de dados inválidos", data: {} })
            }
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }

    async delete(request: Request, response: Response) {
        const { emailAddress } = request.body

        if (!emailAddress) {
            return response.status(400).json({ status: 400, message: "Informe um e-mail", data: {} })
        }

        try {
            const emailExists = await prismaClient.user.findUnique({ where: { email_address: emailAddress } })

            if (!emailExists) {
                return response.status(400).json({ status: 400, message: "E-mail informado não foi encontrado, tente outro", data: {} })
            }

            await prismaClient.user.delete({ where: { email_address: emailAddress } })

            return response.status(200).json({ status: 200, message: "Usuário deletado com sucesso", data: {} })

        } catch (error) {
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }

    async update(request: Request, response: Response) {
        const body = request.body as IUser
        let { fullName, birthDate, emailAddress } = body

        if (!fullName || !emailAddress) {
            return response.status(400).json({ status: 400, message: "Informe todos os parâmetros obrigatórios", data: {} })
        }

        if (birthDate) {
            birthDate = new Date(birthDate)
        }

        try {
            const emailExists = await prismaClient.user.findUnique({ where: { email_address: emailAddress } })

            if (!emailExists) {
                return response.status(400).json({ status: 400, message: "E-mail informado não foi encontrado, tente outro", data: {} })
            }

            await prismaClient.user.updateMany({
                where: {
                    email_address: emailAddress
                }
                , data: { full_name: fullName, birth_date: birthDate }
            })

            return response.status(200).json({ status: 200, message: "Usuário atualizado com sucesso", data: {} })

        } catch (error) {
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }

    async list(request: Request, response: Response) {
        try {
            const users = await prismaClient.user.findMany()
            return response.status(200).json({ status: 200, message: "Consulta realizada com sucesso", data: users })
        } catch (error) {
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }

    async listByEmail(request: Request, response: Response) {
        const emailAddress = request?.query?.email as string
        if (!emailAddress) {
            return response.status(400).json({ status: 400, message: "Informe um e-mail", data: {} })
        }

        try {
            const user = await prismaClient.user.findUnique({ where: { email_address: emailAddress } })
            if (!user) {
                return response.status(400).json({ status: 400, message: "E-mail informado não foi encontrado, tente outro", data: {} })
            }
            return response.status(200).json({ status: 200, message: "Consulta realizada com sucesso", data: user })
        } catch (error) {
            return response.status(500).json({ status: 500, message: "Algo não ocorreu bem por aqui", data: {} })
        }
    }

}