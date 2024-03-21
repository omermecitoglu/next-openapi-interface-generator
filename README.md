# OpenAPI Interface Generator

Provides an npm command to generate TypeScript code for services defined in a source JSON file.

## Installation

```bash
npm install @omer-x/ts-openapi-interface-generator
```

## Usage

1. Ensure you have a `source.json` file in the root directory of your project with the following structure:

```json
{
  "services": [
    {
      "name": "ExampleService",
      "url": "https://example.com/api",
      "specs": "/swagger"
    }
  ]
}
```

2. Run the following command to generate code for each service defined in `source.json`:

```bash
npx generate-service-interfaces
```

This will generate code in the `src` folder for each service.

## Configuration

You can customize the source JSON file by specifying additional properties for each service:

- `name`: The name of the service.
- `url`: The URL of the service.
- `specs` (optional): The path to the OpenAPI specifications. Default value is "/swagger".

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
