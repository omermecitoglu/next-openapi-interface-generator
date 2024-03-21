import Handlebars from "handlebars";

export default function getTemplate<T>(input: string) {
  return Handlebars.compile<T>(input);
}
