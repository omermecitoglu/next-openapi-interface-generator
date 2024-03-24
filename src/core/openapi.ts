export type SchemaDefinition = {
  type?: "string" | "number" | "boolean" | "array" | "object",
  format?: "date" | "unknown",
  description: string,
  readOnly: boolean,
  nullable: boolean,
  $ref?: string,
  items?: SchemaDefinition | SchemaDefinition[],
  oneOf?: SchemaDefinition[],
  enum?: (string | null)[],
  properties?: Record<string, SchemaDefinition>,
  required?: string[],
};

type SchemaComponent = {
  type: "object" | "unknown",
  properties: Record<string, SchemaDefinition>,
  required?: string[],
};

export type OperationParameter = {
  in: "path" | "query" | "header" | "cookie",
  name: string,
  description: string,
  required: boolean,
  schema: SchemaDefinition,
};

type RequestBody = {
  description: string,
  required: boolean,
  content: Content,
};

type ResponseContent = {
  schema: SchemaDefinition,
};

type ContentType = "application/json" | "text/plain";

export type Content = Record<ContentType, ResponseContent>;

type HttpResponse = {
  description: string,
  content?: Content,
};

type HttpCode = "200" | "404";

export type Operation = {
  operationId: string,
  summary: string,
  description: string,
  parameters?: OperationParameter[],
  requestBody?: RequestBody,
  responses: Record<HttpCode, HttpResponse>,
};

type HttpMethod = "get" | "post" | "patch" | "put" | "delete";

export type OpenAPI = {
  components: {
    schemas?: Record<string, SchemaComponent>,
  },
  paths: Record<string, Record<HttpMethod, Operation>>,
};
