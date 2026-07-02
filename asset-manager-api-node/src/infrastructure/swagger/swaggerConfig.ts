import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Asset Manager API",
      version: "1.0.0",
      description: "API para gerenciamento de Assets 3D com upload de arquivos GLB."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ],
    paths: {
      "/api/assets": {
        get: {
          summary: "Lista todos os assets",
          tags: ["Assets"],
          parameters: [
            {
              in: "query",
              name: "search",
              required: false,
              schema: {
                type: "string"
              },
              description: "Busca assets pelo nome"
            }
          ],
          responses: {
            200: {
              description: "Lista de assets retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Asset"
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Cadastra um novo asset com upload de arquivo GLB",
          tags: ["Assets"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["name", "file"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Cadeira 3D"
                    },
                    description: {
                      type: "string",
                      example: "Asset 3D para teste"
                    },
                    category: {
                      type: "string",
                      example: "Mobiliário"
                    },
                    tags: {
                      type: "string",
                      example: "cadeira,glb,teste"
                    },
                    file: {
                      type: "string",
                      format: "binary",
                      description: "Arquivo GLB do asset"
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Asset cadastrado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Asset"
                  }
                }
              }
            },
            400: {
              description: "Dados inválidos ou arquivo ausente"
            }
          }
        }
      },
      "/api/assets/{id}": {
        get: {
          summary: "Busca um asset por ID",
          tags: ["Assets"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset"
            }
          ],
          responses: {
            200: {
              description: "Asset encontrado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Asset"
                  }
                }
              }
            },
            404: {
              description: "Asset não encontrado"
            }
          }
        },
        put: {
          summary: "Atualiza os dados de um asset",
          tags: ["Assets"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "status"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Asset Atualizado"
                    },
                    description: {
                      type: "string",
                      example: "Descrição atualizada"
                    },
                    category: {
                      type: "string",
                      example: "Categoria Atualizada"
                    },
                    tags: {
                      type: "string",
                      example: "glb,updated"
                    },
                    status: {
                      $ref: "#/components/schemas/AssetStatus"
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Asset atualizado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Asset"
                  }
                }
              }
            },
            400: {
              description: "Dados inválidos"
            },
            404: {
              description: "Asset não encontrado"
            }
          }
        },
        delete: {
          summary: "Exclui um asset",
          tags: ["Assets"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset"
            }
          ],
          responses: {
            200: {
              description: "Asset excluído com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Asset excluído com sucesso."
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Asset não encontrado"
            }
          }
        }
      },
      "/api/assets/{id}/download": {
        get: {
          summary: "Baixa o arquivo GLB original do asset",
          tags: ["Assets"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset"
            }
          ],
          responses: {
            200: {
              description: "Download do arquivo original realizado com sucesso",
              content: {
                "model/gltf-binary": {
                  schema: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            },
            404: {
              description: "Asset ou arquivo original não encontrado"
            }
          }
        }
      }
    },
    components: {
      schemas: {
        AssetStatus: {
          type: "string",
          enum: ["PROCESSING", "AVAILABLE", "ERROR", "ARCHIVED"],
          example: "AVAILABLE"
        },
        Asset: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "f911348d-9b9c-4e9c-ac51-d974369a9799"
            },
            name: {
              type: "string",
              example: "Cadeira 3D"
            },
            description: {
              type: "string",
              nullable: true,
              example: "Asset 3D de uma cadeira"
            },
            category: {
              type: "string",
              nullable: true,
              example: "Mobiliário"
            },
            tags: {
              type: "string",
              nullable: true,
              example: "cadeira,glb,teste"
            },
            status: {
              $ref: "#/components/schemas/AssetStatus"
            },
            fileSize: {
              type: "number",
              example: 102400
            },
            thumbnailPath: {
              type: "string",
              nullable: true,
              example: null
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        }
      }
    }
  },
  apis: []
});
