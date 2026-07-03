import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Asset Manager API",
      version: "1.0.0",
      description: "API para gerenciamento, upload, download e exportação de Assets 3D."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ],
    tags: [
      {
        name: "Assets",
        description: "Operações do asset 3D original"
      },
      {
        name: "Asset Exports",
        description: "Operações de exportação e download de arquivos convertidos"
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
                  $ref: "#/components/schemas/UpdateAssetRequest"
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
                    $ref: "#/components/schemas/SuccessResponse"
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
      },

      "/api/assets/{assetId}/exports": {
        post: {
          summary: "Cria uma exportação para o asset",
          tags: ["Asset Exports"],
          parameters: [
            {
              in: "path",
              name: "assetId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset original"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateAssetExportRequest"
                }
              }
            }
          },
          responses: {
            201: {
              description: "Exportação criada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExportedAssetFileResponse"
                  }
                }
              }
            },
            400: {
              description: "Formato inválido ou erro ao exportar"
            },
            404: {
              description: "Asset não encontrado"
            },
            501: {
              description: "Formato previsto na arquitetura, mas dependente de pipeline externo"
            }
          }
        },
        get: {
          summary: "Lista as exportações de um asset",
          tags: ["Asset Exports"],
          parameters: [
            {
              in: "path",
              name: "assetId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset original"
            }
          ],
          responses: {
            200: {
              description: "Lista de exportações retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ExportedAssetFile"
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

      "/api/assets/{assetId}/exports/{exportId}": {
        get: {
          summary: "Busca uma exportação por ID",
          tags: ["Asset Exports"],
          parameters: [
            {
              in: "path",
              name: "assetId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset original"
            },
            {
              in: "path",
              name: "exportId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID da exportação"
            }
          ],
          responses: {
            200: {
              description: "Exportação encontrada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExportedAssetFile"
                  }
                }
              }
            },
            404: {
              description: "Arquivo exportado não encontrado"
            }
          }
        },
        delete: {
          summary: "Exclui uma exportação",
          tags: ["Asset Exports"],
          parameters: [
            {
              in: "path",
              name: "assetId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset original"
            },
            {
              in: "path",
              name: "exportId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID da exportação"
            }
          ],
          responses: {
            200: {
              description: "Exportação excluída com sucesso",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/SuccessResponse"
                  }
                }
              }
            },
            404: {
              description: "Arquivo exportado não encontrado"
            }
          }
        }
      },

      "/api/assets/{assetId}/exports/{exportId}/download": {
        get: {
          summary: "Baixa o arquivo exportado",
          tags: ["Asset Exports"],
          parameters: [
            {
              in: "path",
              name: "assetId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID do asset original"
            },
            {
              in: "path",
              name: "exportId",
              required: true,
              schema: {
                type: "string"
              },
              description: "ID da exportação"
            }
          ],
          responses: {
            200: {
              description: "Download do arquivo exportado realizado com sucesso",
              content: {
                "application/octet-stream": {
                  schema: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            },
            404: {
              description: "Arquivo exportado não encontrado"
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

        ExportStatus: {
          type: "string",
          enum: ["PENDING", "PROCESSING", "COMPLETED", "ERROR"],
          example: "COMPLETED"
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
        },

        UpdateAssetRequest: {
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
              example: "Mobiliário"
            },
            tags: {
              type: "string",
              example: "cadeira,glb,updated"
            },
            status: {
              $ref: "#/components/schemas/AssetStatus"
            }
          }
        },

        CreateAssetExportRequest: {
          type: "object",
          required: ["format"],
          properties: {
            format: {
              type: "string",
              enum: ["gltf", "glb", "optimized-glb", "fbx", "usd", "usda", "usdc", "datasmith"],
              example: "gltf"
            },
            profile: {
              type: "string",
              enum: ["web-optimized", "high-quality", "editable"],
              example: "web-optimized"
            },
            quality: {
              type: "number",
              example: 80
            },
            textureSize: {
              type: "number",
              example: 1024
            },
            simplifyRatio: {
              type: "number",
              example: 0.75
            },
            dracoCompression: {
              type: "boolean",
              example: true
            },
            rotation: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                  example: 0
                },
                y: {
                  type: "number",
                  example: 90
                },
                z: {
                  type: "number",
                  example: 0
                }
              }
            },
            scale: {
              type: "number",
              example: 1
            },
            camera: {
              type: "object",
              properties: {
                fieldOfView: {
                  type: "number",
                  example: 45
                },
                zoom: {
                  type: "number",
                  example: 1.2
                }
              }
            },
            lighting: {
              type: "object",
              properties: {
                exposure: {
                  type: "number",
                  example: 1
                },
                intensity: {
                  type: "number",
                  example: 2
                },
                environment: {
                  type: "string",
                  example: "studio"
                }
              }
            }
          }
        },

        ExportedAssetFile: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "a1c9e9f8-88c2-45a5-bf34-999999999999"
            },
            assetId: {
              type: "string",
              example: "f911348d-9b9c-4e9c-ac51-d974369a9799"
            },
            format: {
              type: "string",
              example: "gltf"
            },
            profile: {
              type: "string",
              nullable: true,
              example: "web-optimized"
            },
            optionsJson: {
              type: "string",
              nullable: true,
              example: "{\"format\":\"gltf\",\"quality\":80}"
            },
            fileName: {
              type: "string",
              example: "f911348d-9b9c-4e9c-ac51-d974369a9799-1710000000000.gltf"
            },
            filePath: {
              type: "string",
              example: "storage/exports/f911348d-9b9c-4e9c-ac51-d974369a9799-1710000000000.gltf"
            },
            fileSize: {
              type: "number",
              example: 204800
            },
            status: {
              $ref: "#/components/schemas/ExportStatus"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            }
          }
        },

        ExportedAssetFileResponse: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            assetId: {
              type: "string"
            },
            format: {
              type: "string",
              example: "gltf"
            },
            profile: {
              type: "string",
              example: "web-optimized"
            },
            fileName: {
              type: "string"
            },
            fileSize: {
              type: "number"
            },
            status: {
              $ref: "#/components/schemas/ExportStatus"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            downloadUrl: {
              type: "string",
              example: "/api/assets/f911348d-9b9c-4e9c-ac51-d974369a9799/exports/a1c9e9f8-88c2-45a5-bf34-999999999999/download"
            }
          }
        },

        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operação realizada com sucesso."
            }
          }
        }
      }
    }
  },
  apis: []
});
