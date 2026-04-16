export default function validateParams(schema: any) {
  return async (req: any, rep: any) => {
    req.params = schema.parse(req.params);
  };
}
