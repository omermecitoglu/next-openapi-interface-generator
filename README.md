# Next OpenAPI Interface Generator

[![NPM](https://img.shields.io/npm/v/@omer-x/next-openapi-interface-generator?logo=npm)](https://www.npmjs.com/package/@omer-x/next-openapi-interface-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


This script automates the generation of documentation and TypeScript interfaces for a service, making it easier to maintain and interact with the service in a TypeScript environment.

## Installation

```bash
npm install @omer-x/next-openapi-interface-generator
```

## Usage

```bash
generate-service-interface --output <output_directory> --framework <framework_name> --schemas <schemas_directory>
```

### Options

- `--output`, `-o`: Specify the output directory. Default: `dist`
- `--framework`, `-f`: (Optional) Specify the target framework. Options: `next`
- `--schemas`, `-s`: (Optional) Specify the path for predefined zod schemas. Multiple paths can be provided, separated by commas.

## Example

```bash
generate-service-interface -o dist -f next -s src/models
generate-service-interface -o dist -f next -s src/models/user,src/models/message
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have any suggestions for improvement.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
