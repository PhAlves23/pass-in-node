import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int().positive(),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
              slug: true,
              details: true,
              maximumAttendees: true,
              _count: {
                select: {
                  attendees: true,
                },
              },
            },
          },
        },
        where: {
          id: attendeeId,
        },
      });

      if (attendee === null) {
        throw new Error("Attendee not found");
      }

      return reply.status(200).send({
        attendee: {
          id: attendeeId,
          name: attendee.name,
          email: attendee.email,
          event: {
            title: attendee.event.title,
            details: attendee.event.details,
            slug: attendee.event.slug,
            maximumAttendees: attendee.event.maximumAttendees,
            attendeesAmount: attendee.event._count.attendees,
          },
        },
      });
    }
  );
}
