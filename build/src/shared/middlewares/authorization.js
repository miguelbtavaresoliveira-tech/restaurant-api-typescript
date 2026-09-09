export function authorize(roles) {
    return async (request, reply) => {
        const userRole = request.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            return reply.status(403).send({ message: "Acesso negado" });
        }
    };
}
