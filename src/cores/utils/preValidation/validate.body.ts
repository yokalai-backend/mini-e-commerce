export default function (schema: any) {
  return async (req: any, rep: any) => {
    req.body = schema.parse(req.body);
  };
}
