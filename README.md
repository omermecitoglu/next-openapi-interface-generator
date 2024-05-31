# Next OpenAPI Interface Generator

![GitHub](https://img.shields.io/github/license/omermecitoglu/next-openapi-interface-generator)
![GitHub package.json version](https://img.shields.io/github/package-json/v/omermecitoglu/next-openapi-interface-generator)

This script automates the generation of documentation and TypeScript interfaces for a service, making it easier to maintain and interact with the service in a TypeScript environment.

## Installation

```bash
npm install @omer-x/next-openapi-interface-generator
```

## Usage

```bash
generate-service-interface --source <source_directory> --output <output_directory>
```

### Options

- `--source`, `-s`: Specify the source directory. Default: `src`
- `--output`, `-o`: Specify the output directory. Default: `dist`
- `--framework`, `-f`: Specify the target framework. Options: `next` (Optional)

## Example

```bash
generate-service-interface --source src/app --output dist
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have any suggestions for improvement.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
