import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mini Blog API',
            version: '1.0.0',
            description: 'API documentation for the Mini Blog application',
        },
        servers: [{url: 'http://localhost:8080'}],
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security:[{bearerAuth: []}],
    },
    apis: ['./src/routes/*.ts'],
};                                              

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;