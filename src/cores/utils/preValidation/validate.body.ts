export default function (schema: any) {
  return async (req: any) => {
    req.body = schema.parse(req.body);
  };
}
